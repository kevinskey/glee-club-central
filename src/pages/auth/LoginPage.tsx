import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LogIn, UserPlus, Mail, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteImage } from '@/components/site/SiteImage';
import { cleanupAuthState, resetAuthSystem } from '@/contexts/AuthContext';
import { addCentennialImageToLibrary } from '@/utils/addCentennialImage';

const LoginPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const [hasRedirected, setHasRedirected] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
  // Add the centennial image to library on component mount
  React.useEffect(() => {
    addCentennialImageToLibrary();
  }, []);
  
  // Preload the background image
  React.useEffect(() => {
    const img = new Image();
    img.src = '/lovable-uploads/5d6ba7fa-4ea7-42ac-872e-940fb620a273.png';
    img.onload = () => setImageLoaded(true);
  }, []);
  
  // Get saved redirect path
  const getRedirectPath = () => {
    const savedPath = sessionStorage.getItem('authRedirectPath');
    const timestamp = sessionStorage.getItem('authRedirectTimestamp');
    
    if (savedPath && timestamp && Date.now() - parseInt(timestamp) < 5 * 60 * 1000) {
      return savedPath;
    }
    
    return '/role-dashboard';
  };
  
  // Handle authenticated user redirect
  React.useEffect(() => {
    if (isAuthenticated && !isLoading && !isSubmitting && !hasRedirected) {
      const redirectPath = getRedirectPath();
      console.log('User authenticated, redirecting to:', redirectPath);
      
      setHasRedirected(true);
      
      // Use setTimeout to prevent redirect loops
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
        
        // Clean up stored redirect path
        sessionStorage.removeItem('authRedirectPath');
        sessionStorage.removeItem('authRedirectTimestamp');
      }, 100);
    }
  }, [isAuthenticated, isLoading, navigate, isSubmitting, hasRedirected]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await login(email, password);
      
      if (result.error) {
        console.error("Login error:", result.error);
        toast.error(result.error.message || "Login failed");
        setIsSubmitting(false);
      } else {
        toast.success("Login successful!");
        // Don't set isSubmitting to false here - let the redirect effect handle it
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      toast.error("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };
  
  // Handle auth system reset
  const handleResetAuth = async () => {
    if (window.confirm("Are you sure you want to reset the authentication system? This will clear all login data.")) {
      setIsResetting(true);
      try {
        await resetAuthSystem();
        toast.success("Authentication system reset successfully");
      } catch (error) {
        console.error("Error resetting auth system:", error);
        toast.error("Failed to reset authentication system");
        setIsResetting(false);
      }
    }
  };
  
  // Show loading only for initial auth check
  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Show redirecting state when authenticated
  if (isAuthenticated && !hasRedirected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Main login form
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background image with smooth loading */}
      <div className="absolute inset-0 z-0">
        <div 
          className={`w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('/lovable-uploads/5d6ba7fa-4ea7-42ac-872e-940fb620a273.png')`
          }}
        />
        {/* Fallback background color while image loads */}
        <div className="absolute inset-0 bg-gray-900" />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Login form container */}
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="w-full border-border bg-card/95 backdrop-blur-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-card-foreground">Spelman Glee Club Portal</CardTitle>
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
                  className="bg-background/70 text-foreground border-input"
                  required
                  disabled={isSubmitting}
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
                  className="bg-background/70 text-foreground border-input"
                  required
                  disabled={isSubmitting}
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
                {isSubmitting ? 'Signing In...' : 'Sign In'}
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
              <Button variant="outline" className="w-full border-input text-foreground hover:bg-accent/10" asChild>
                <Link to="/signup">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Request Member Access
                </Link>
              </Button>
              <Button variant="outline" className="w-full border-input text-foreground hover:bg-accent/10">
                <Mail className="w-4 h-4 mr-2" />
                Contact Administrator
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-input text-destructive hover:bg-destructive/10"
                onClick={handleResetAuth}
                disabled={isResetting}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                {isResetting ? "Resetting..." : "Reset Authentication"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
