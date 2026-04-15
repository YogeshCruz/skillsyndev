import { useState, useCallback, useEffect, useRef } from "react";
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

  // Reset upload state when user logs in
  useEffect(() => {
    if (user) {
      setUploadStatus('idle');
      setUploadProgress(0);
      sessionStorage.removeItem('resumeScore');
      sessionStorage.removeItem('scoreExplanation');
      sessionStorage.removeItem('extractedSkills');
      sessionStorage.removeItem('extractedEducation');
      sessionStorage.removeItem('extractedExperience');
    }
  }, [user?.id]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (file: File) => {
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

    if (file.size > 10 * 1024 * 1024) {
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      const formData = new FormData();
      formData.append('file', file);

      setUploadProgress(30);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-resume`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      setUploadProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      setUploadStatus('processing');
      setUploadProgress(100);
      
      if (result.data?.resume_score === 0) {
        setUploadStatus('error');
        toast({
          variant: "destructive",
          title: "This file doesn't look like a valid résumé",
          description: "Please upload a proper resume document with your work experience, skills, and education.",
        });
        return;
      }
      
      setUploadStatus('complete');
      
      sessionStorage.setItem('resumeScore', String(result.data?.resume_score || 0));
      if (result.data?.score_explanation) {
        sessionStorage.setItem('scoreExplanation', result.data.score_explanation);
        sessionStorage.setItem('resumeScoreExplanation', result.data.score_explanation);
      }
      if (result.data?.skills) {
        sessionStorage.setItem('extractedSkills', JSON.stringify(result.data.skills));
      }
      if (result.data?.education) {
        sessionStorage.setItem('extractedEducation', JSON.stringify(result.data.education));
      }
      if (result.data?.experience) {
        sessionStorage.setItem('extractedExperience', JSON.stringify(result.data.experience));
      }
      
      window.dispatchEvent(new CustomEvent('resumeUploaded'));
      
      toast({
        title: "Resume processed successfully!",
        description: `Your resume scored ${result.data?.resume_score || 0}/100. View your dashboard for details.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: errorMessage.includes('Rate limit') ? errorMessage : "There was an error processing your resume. Please try again.",
      });
    }
  }, [user, toast]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input so same file can be re-uploaded
    if (event.target) event.target.value = '';
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
                  onClick={() => document.getElementById('resumeUploadInput')?.click()}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Drop your resume here</h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <Button variant="outline" type="button">
                    Choose File
                  </Button>
                  <input
                    id="resumeUploadInput"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-4">
                    PDF, DOC, or DOCX files only, max 10MB
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
                    {uploadStatus === 'uploading' ? 'Uploading...' : uploadStatus === 'processing' ? 'Validating resume...' : 'Processing...'}
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
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      variant="hero"
                      onClick={() => {
                        const dashboard = document.getElementById('dashboard');
                        if (dashboard) {
                          dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                    >
                      View My Dashboard
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setUploadStatus('idle');
                        setUploadProgress(0);
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Another Resume
                    </Button>
                  </div>
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