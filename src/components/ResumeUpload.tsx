import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

const ResumeUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to upload your resume.",
      });
      return;
    }

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      // Upload to Supabase Storage
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setUploadProgress(50);
      setUploadStatus('processing');

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      // Simulate skill extraction (in production, this would call an AI service)
      const mockSkills = ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'];
      const mockEducation = ['Bachelor in Computer Science'];
      const mockExperience = ['Software Developer', 'Frontend Developer'];

      // Save resume data to database
      const { error: dbError } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          filename: file.name,
          file_url: publicUrl,
          skills: mockSkills,
          education: mockEducation,
          experience: mockExperience,
          resume_score: Math.floor(Math.random() * 30) + 70, // Mock score 70-100
        });

      if (dbError) throw dbError;

      setUploadProgress(100);
      setUploadStatus('complete');
      
      toast({
        title: "Resume processed successfully!",
        description: "Your skills have been analyzed and job matches are ready.",
      });

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error processing your resume. Please try again.",
      });
    }
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  return (
    <section id="resume-upload" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Upload Your Resume</h2>
            <p className="text-muted-foreground">
              Let our AI analyze your skills and find perfect career matches
            </p>
          </div>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume Analysis
              </CardTitle>
              <CardDescription>
                Upload your PDF resume to get started with personalized career insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadStatus === 'idle' && (
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Drop your resume here</h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <Button variant="outline">
                    Choose File
                  </Button>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-4">
                    PDF files only, max 10MB
                  </p>
                </div>
              )}

              {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
                <div className="text-center py-8">
                  <div className="mb-4">
                    {uploadStatus === 'uploading' ? (
                      <Upload className="h-12 w-12 text-primary mx-auto animate-pulse" />
                    ) : (
                      <FileText className="h-12 w-12 text-primary mx-auto animate-pulse" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {uploadStatus === 'uploading' ? 'Uploading...' : 'Processing...'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {uploadStatus === 'uploading' 
                      ? 'Uploading your resume securely' 
                      : 'Analyzing your skills and experience'
                    }
                  </p>
                  <Progress value={uploadProgress} className="max-w-xs mx-auto" />
                </div>
              )}

              {uploadStatus === 'complete' && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analysis Complete!</h3>
                  <p className="text-muted-foreground mb-6">
                    Your resume has been successfully analyzed. Ready to see your matches?
                  </p>
                  <Button variant="hero">
                    View My Dashboard
                  </Button>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Failed</h3>
                  <p className="text-muted-foreground mb-6">
                    Something went wrong. Please try again.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setUploadStatus('idle')}
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ResumeUpload;