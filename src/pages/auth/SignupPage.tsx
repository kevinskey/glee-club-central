
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignupPage() {
  const { signUp, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [signupError, setSignupError] = React.useState<string | null>(null);
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/role-dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSignupError(null);
    
    // Validate form fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setSignupError("Please fill all required fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }
    
    if (!email.includes('@')) {
      setSignupError("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('SignupPage: Starting signup for:', email);
      const { error, data } = await signUp(email, password, firstName, lastName);
      
      if (error) {
        console.error("SignupPage: Signup error:", error);
        let errorMessage = "Signup failed";
        if (error.message) {
          if (error.message.includes('already registered')) {
            errorMessage = "This email is already registered. Please use a different email or try logging in.";
          } else {
            errorMessage = error.message;
          }
        }
        setSignupError(errorMessage);
        toast.error(errorMessage);
      } else if (data) {
        console.log("SignupPage: Signup successful");
        toast.success("Account created successfully! Please check your email to verify your account.");
        navigate('/login', { 
          state: { 
            message: "Please check your email for a verification link to complete your registration." 
          } 
        });
      }
    } catch (err: any) {
      console.error("SignupPage: Unexpected signup error:", err);
      const errorMessage = err.message || "An unexpected error occurred during signup";
      setSignupError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center animate-fade-in"
      style={{
        backgroundImage: `url('/lovable-uploads/5d6ba7fa-4ea7-42ac-872e-940fb620a273.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30 z-0" />
      
      {/* Signup form container */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-white/20 dark:border-white/10">
          <Card className="w-full border-0 bg-transparent shadow-none">
            <CardHeader className="space-y-1 text-center px-0">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Join Glee World
              </CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Create your account to access member resources
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSignup} className="space-y-4">
                {signupError && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md">
                    {signupError}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-900 dark:text-gray-100">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                      required
                      disabled={isSubmitting}
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-900 dark:text-gray-100">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                      required
                      disabled={isSubmitting}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    required
                    disabled={isSubmitting}
                    placeholder="jane.doe@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-900 dark:text-gray-100">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    required
                    disabled={isSubmitting}
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-900 dark:text-gray-100">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    required
                    disabled={isSubmitting}
                    placeholder="••••••••"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-glee-spelman hover:bg-glee-spelman/90 text-white" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm">
                <span className="text-gray-700 dark:text-gray-300">Already have an account? </span>
                <Link to="/login" className="text-glee-purple hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
