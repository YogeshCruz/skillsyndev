import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

const ResumeUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    // Simulate upload process
    setUploadStatus('uploading');
    setUploadProgress(0);

    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploadStatus('processing');
          
          // Simulate processing
          setTimeout(() => {
            setUploadStatus('complete');
            toast({
              title: "Resume uploaded successfully!",
              description: "Your resume has been analyzed and processed.",
            });
          }, 2000);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, [toast]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const inputEvent = { target: { files: [file] } } as any;
      handleFileUpload(inputEvent);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Upload Your Resume</h2>
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
                    onChange={handleFileUpload}
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