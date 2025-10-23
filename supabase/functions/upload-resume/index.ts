import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Hash computation for caching
async function computeFileHash(fileBuffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Resume validation functions
function looksLikeResume(text: string): boolean {
  const resumeKeywords = [
    "experience", "education", "skills", "projects",
    "summary", "objective", "work history", "employment",
    "qualifications", "resume", "cv", "curriculum vitae"
  ];
  const matches = resumeKeywords.filter(k =>
    text.toLowerCase().includes(k)
  );
  return matches.length >= 2; // heuristic threshold
}

function validateResumeContent(text: string, fileType: string, fileSize: number): { valid: boolean; reason?: string } {
  // Check if file is too short or image-only
  if (fileType.startsWith("image/") || text.length < 400) {
    return { valid: false, reason: "File too short or image-only" };
  }

  // Check if it looks like a resume
  if (!looksLikeResume(text)) {
    return { valid: false, reason: "Not a résumé-format document" };
  }

  return { valid: true };
}

async function extractTextFromPDF(fileBuffer: ArrayBuffer): Promise<string> {
  // Simple text extraction - decode as UTF-8 and extract readable text
  const decoder = new TextDecoder('utf-8', { fatal: false });
  const text = decoder.decode(fileBuffer);
  
  // Extract text between PDF content streams (simplified approach)
  const textMatches = text.match(/\(([^)]+)\)/g) || [];
  const extractedText = textMatches
    .map(match => match.slice(1, -1))
    .join(' ')
    .replace(/\\[nrt]/g, ' ')
    .trim();
  
  return extractedText || text;
}

// Feature extraction for deterministic scoring
function extractFeatures(text: string) {
  const t = text.toLowerCase();
  
  // Check for key sections
  const sections = {
    experience: t.includes('experience') || t.includes('work history'),
    education: t.includes('education') || t.includes('degree'),
    skills: t.includes('skills') || t.includes('competencies'),
    contact: /email:|@/.test(t) || /phone:|mobile:|contact:/.test(t)
  };
  
  // Extract years of experience heuristic
  const yearsMatch = (t.match(/(\d+)\s+years?/g) || []).map(m => parseInt(m));
  const years = yearsMatch.length ? Math.max(...yearsMatch) : 0;
  
  return { sections, years, rawText: text };
}

function sectionScore(sections: { [key: string]: boolean }): number {
  const total = 4;
  const present = Object.values(sections).filter(Boolean).length;
  return (present / total) * 30; // 30% weight
}

function experienceScore(years: number): number {
  if (years <= 0) return 0;
  if (years <= 2) return 7;
  if (years <= 5) return 14;
  return 20; // 20% weight
}

function keywordScore(text: string, jobKeywords: string[] = []): number {
  if (!jobKeywords.length) return 0;
  let match = 0;
  const lowerText = text.toLowerCase();
  for (const k of jobKeywords) {
    if (lowerText.includes(k.toLowerCase())) match++;
  }
  return (match / jobKeywords.length) * 25; // 25% weight
}

function formattingScore(text: string): number {
  // Simple readability heuristic: bullet points indicate good formatting
  const bullets = (text.match(/[-••*]\s/g) || []).length;
  return Math.min(10, bullets); // 10% weight scaled by bullet count
}

function educationScore(text: string): number {
  const lowerText = text.toLowerCase();
  if (/phd|doctorate/.test(lowerText)) return 15;
  if (/master|mba|m\.s|m\.a/.test(lowerText)) return 12;
  if (/bachelor|b\.s|b\.a|b\.tech|b\.e/.test(lowerText)) return 10;
  if (/diploma|associate/.test(lowerText)) return 5;
  return 0; // 15% weight
}

async function calculateResumeScore(text: string, jobKeywords: string[] = []): Promise<number> {
  const features = extractFeatures(text);
  
  const s1 = sectionScore(features.sections);
  const s2 = experienceScore(features.years);
  const s3 = keywordScore(features.rawText, jobKeywords);
  const s4 = formattingScore(features.rawText);
  const s5 = educationScore(features.rawText);
  
  let score = s1 + s2 + s3 + s4 + s5;
  score = Math.round(Math.max(0, Math.min(100, score)));
  
  return score;
}

async function generateScoreExplanation(score: number, text: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    return `Score: ${score}/100. Basic resume analysis completed.`;
  }
  
  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are a resume scoring assistant. Provide a brief, constructive explanation of the resume score in 2-3 sentences.' 
          },
          { 
            role: 'user', 
            content: `Score: ${score}/100. Analyze this resume and explain the score, highlighting strengths and areas for improvement:\n\n${text.slice(0, 2000)}` 
          }
        ],
        temperature: 0.3,
      }),
    });
    
    if (!response.ok) {
      console.error('AI API error:', response.status);
      return `Score: ${score}/100. Resume analysis completed.`;
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating explanation:', error);
    return `Score: ${score}/100. Resume analysis completed.`;
  }
}

// Rate limiting map: user_id -> { uploads: number, resetTime: number }
const rateLimitMap = new Map<string, { uploads: number; resetTime: number }>();
const MAX_UPLOADS_PER_HOUR = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limiting check
    const now = Date.now();
    const userRateLimit = rateLimitMap.get(user.id);
    
    if (userRateLimit) {
      if (now < userRateLimit.resetTime) {
        if (userRateLimit.uploads >= MAX_UPLOADS_PER_HOUR) {
          return new Response(
            JSON.stringify({ error: `Rate limit exceeded. Maximum ${MAX_UPLOADS_PER_HOUR} uploads per hour.` }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        userRateLimit.uploads++;
      } else {
        rateLimitMap.set(user.id, { uploads: 1, resetTime: now + 3600000 }); // 1 hour
      }
    } else {
      rateLimitMap.set(user.id, { uploads: 1, resetTime: now + 3600000 });
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Server-side validation
    if (file.type !== 'application/pdf') {
      return new Response(
        JSON.stringify({ error: "Invalid file type. Only PDF files are allowed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get file buffer and extract text for validation
    const fileBuffer = await file.arrayBuffer();
    const extractedText = await extractTextFromPDF(fileBuffer);
    
    // Validate resume content
    const validation = validateResumeContent(extractedText, file.type, file.size);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ 
          error: `Invalid resume: ${validation.reason}. Please upload a valid resume document.` 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Compute file hash for caching
    const fileHash = await computeFileHash(fileBuffer);
    
    // Check cache - if identical file already processed, return cached result
    const { data: cachedResume } = await supabase
      .from('resumes')
      .select('*')
      .eq('file_hash', fileHash)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (cachedResume) {
      console.log('Returning cached resume score for hash:', fileHash);
      return new Response(
        JSON.stringify({ 
          success: true,
          data: cachedResume,
          cached: true
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Upload to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(fileName, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Failed to upload file');
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);

    // Extract skills, education, and experience from text (basic extraction)
    const lowerText = extractedText.toLowerCase();
    const skills: string[] = [];
    const commonSkills = ['javascript', 'react', 'node.js', 'python', 'sql', 'git', 'typescript', 'java', 'c++', 'html', 'css', 'aws', 'docker', 'kubernetes'];
    commonSkills.forEach(skill => {
      if (lowerText.includes(skill)) skills.push(skill);
    });
    
    const education: string[] = [];
    if (/bachelor|b\.s|b\.a|b\.tech|b\.e/.test(lowerText)) education.push('Bachelor\'s Degree');
    if (/master|mba|m\.s|m\.a/.test(lowerText)) education.push('Master\'s Degree');
    if (/phd|doctorate/.test(lowerText)) education.push('PhD');
    
    const experience: string[] = [];
    if (lowerText.includes('developer')) experience.push('Developer');
    if (lowerText.includes('engineer')) experience.push('Engineer');
    if (lowerText.includes('manager')) experience.push('Manager');

    // Calculate deterministic score
    const resumeScore = await calculateResumeScore(extractedText);
    
    // Generate AI explanation
    const scoreExplanation = await generateScoreExplanation(resumeScore, extractedText);

    // Save resume data to database
    const { data: resumeData, error: dbError } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        filename: file.name,
        file_url: publicUrl,
        file_hash: fileHash,
        skills: skills.length > 0 ? skills : ['General Skills'],
        education: education.length > 0 ? education : ['Education information'],
        experience: experience.length > 0 ? experience : ['Work experience'],
        resume_score: resumeScore,
        score_explanation: scoreExplanation,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save resume data');
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: resumeData
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Resume upload error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process resume" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
