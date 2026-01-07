import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userSkills, skillGaps, resumeScore } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a career development AI assistant for SkillSync. Generate a personalized 7-day action plan based on the user's current skills and skill gaps.

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, no extra text.

The response must be a JSON object with this exact structure:
{
  "weeklyPlan": [
    {
      "day": 1,
      "dayName": "Day 1 - Monday",
      "tasks": [
        {
          "id": "unique-id",
          "title": "Task title",
          "description": "Brief description of what to do",
          "duration": "30 min",
          "outcome": "What you'll achieve",
          "completed": false,
          "skill": "Skill name"
        }
      ]
    }
  ]
}

Guidelines:
- Create 2-3 tasks per day
- Each task should be 15-60 minutes
- Focus on practical, actionable items
- Include a mix of learning, practice, and project work
- Prioritize skill gaps but also reinforce existing skills
- Make outcomes measurable and specific
- Keep descriptions concise but clear
- Day names should include the day number and general label (Day 1, Day 2, etc.)`;

    const userPrompt = `Generate a 7-day action plan for a user with:
- Current Skills: ${userSkills.length > 0 ? userSkills.join(", ") : "Not specified"}
- Skill Gaps to Focus On: ${skillGaps.length > 0 ? skillGaps.join(", ") : "General career development"}
- Resume Score: ${resumeScore}/100

Create practical daily tasks that help close skill gaps while building on existing strengths.`;

    console.log("Generating weekly action plan for user with skills:", userSkills);
    console.log("Skill gaps:", skillGaps);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("Raw AI response:", content);

    // Parse the JSON response
    let weeklyPlan;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();

      const parsed = JSON.parse(cleanContent);
      weeklyPlan = parsed.weeklyPlan || parsed;
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Content was:", content);
      
      // Generate a fallback plan
      weeklyPlan = generateFallbackPlan(skillGaps, userSkills);
    }

    return new Response(JSON.stringify({ weeklyPlan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Weekly action plan error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateFallbackPlan(skillGaps: string[], userSkills: string[]) {
  const skills = skillGaps.length > 0 ? skillGaps : userSkills.length > 0 ? userSkills : ["General Skills"];
  const days = ["Day 1 - Foundation", "Day 2 - Learning", "Day 3 - Practice", "Day 4 - Application", "Day 5 - Review", "Day 6 - Project", "Day 7 - Reflection"];
  
  return days.map((dayName, index) => ({
    day: index + 1,
    dayName,
    tasks: [
      {
        id: `task-${index}-1`,
        title: `Study ${skills[index % skills.length] || "core concepts"}`,
        description: "Review documentation and tutorials for this skill",
        duration: "30 min",
        outcome: "Understand key concepts",
        completed: false,
        skill: skills[index % skills.length] || "General",
      },
      {
        id: `task-${index}-2`,
        title: "Hands-on practice",
        description: "Apply what you learned with practical exercises",
        duration: "45 min",
        outcome: "Build practical experience",
        completed: false,
        skill: skills[index % skills.length] || "General",
      },
    ],
  }));
}