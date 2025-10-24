import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { validateEmail, validateSignUpForm } from "@/lib/auth-validation";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleAuth = async (type: 'login' | 'signup') => {
    // Reset errors
    setErrors({ email: '', password: '' });
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (type === 'login') {
        // Basic email validation for login
        const emailError = validateEmail(formData.email);
        if (emailError) {
          setErrors(prev => ({ ...prev, email: emailError }));
          toast({
            title: "Validation Error",
            description: emailError,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        const result = await signIn(formData.email, formData.password);
        if (!result.error) {
          onOpenChange(false); // Close modal on successful login
        }
      } else {
        // Full validation for signup including breach check
        const validation = await validateSignUpForm(formData.email, formData.password);
        
        if (!validation.isValid) {
          toast({
            title: "Validation Error",
            description: validation.error,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        const result = await signUp(formData.email, formData.password, formData.fullName);
        if (!result.error) {
          onOpenChange(false); // Close modal on successful signup
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <Card className="border-0 shadow-none">
          <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5 pb-8">
            <CardTitle className="text-2xl text-center text-gradient">Welcome to SkillSync</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Your career alignment journey starts here
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      placeholder="Enter your email" 
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, email: e.target.value }));
                        setErrors(prev => ({ ...prev, email: '' }));
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password" 
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, password: e.target.value }));
                        setErrors(prev => ({ ...prev, password: '' }));
                      }}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>
                <Button 
                  className="w-full mt-6" 
                  variant="hero"
                  onClick={() => handleAuth('login')}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name" 
                      placeholder="Enter your full name" 
                      className="pl-10"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-email" 
                      placeholder="Enter your email" 
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="Create a password" 
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, password: e.target.value }));
                        setErrors(prev => ({ ...prev, password: '' }));
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be 8+ characters with uppercase, lowercase, and a number
                  </p>
                </div>
                <Button 
                  className="w-full mt-6" 
                  variant="hero"
                  onClick={() => handleAuth('signup')}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;