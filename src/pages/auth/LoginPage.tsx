
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LogIn, UserPlus, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Get returnTo from query params
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnTo') || '/role-dashboard';
  const intent = searchParams.get('intent');
  
  console.log("Login page loaded with params:", { returnTo, intent });
  
  // Store returnTo in sessionStorage for use after login
  React.useEffect(() => {
    if (returnTo) {
      sessionStorage.setItem('authRedirectPath', returnTo);
    }
    if (intent) {
      sessionStorage.setItem('authRedirectIntent', intent);
    }
  }, [returnTo, intent]);
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("User already authenticated, redirecting to:", returnTo);
      navigate(returnTo);
    }
  }, [isAuthenticated, isLoading, navigate, returnTo]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    console.log("Attempting login with:", { email });
    setIsSubmitting(true);
    
    try {
      const result = await login(email, password);
      
      if (result.error) {
        console.error("Login error:", result.error);
        toast.error(result.error.message || "Login failed");
      } else {
        // Get redirectPath from result if it exists, otherwise use returnTo
        // TypeScript fix: Check if result has returnTo property before accessing it
        const redirectPath = 'returnTo' in result ? result.returnTo : returnTo;
        console.log("Login successful, redirecting to:", redirectPath || returnTo);
        navigate(redirectPath || returnTo);
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      toast.error("An unexpected error occurred");
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
    <div className="flex items-center justify-center min-h-[80vh] px-4 bg-background">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-card-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background text-foreground border-input"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Link to="/forgot-password" className="text-sm text-glee-purple hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background text-foreground border-input"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-glee-spelman hover:bg-glee-spelman/90 text-white" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              Sign In
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-glee-purple hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" className="w-full border-input text-foreground hover:bg-accent/10">
              <UserPlus className="w-4 h-4 mr-2" />
              Request Member Access
            </Button>
            <Button variant="outline" className="w-full border-input text-foreground hover:bg-accent/10">
              <Mail className="w-4 h-4 mr-2" />
              Contact Administrator
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
