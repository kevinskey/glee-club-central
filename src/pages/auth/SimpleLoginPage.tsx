
import React, { useState, useEffect } from 'react';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const SimpleLoginPage = () => {
  const { login, isAuthenticated, isLoading, user, isInitialized } = useSimpleAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Handle redirect after successful authentication
  useEffect(() => {
    if (isAuthenticated && user && isInitialized && !isSubmitting) {
      console.log('SimpleLoginPage: Authenticated user detected, redirecting...');
      const from = location.state?.from?.pathname || '/role-dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, isInitialized, navigate, location.state, isSubmitting]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoginError(null);
    
    if (!email || !password) {
      setLoginError("Please enter both email and password");
      return;
    }
    
    if (!email.includes('@')) {
      setLoginError("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('SimpleLoginPage: Starting login for:', email);
      const result = await login(email, password);
      
      if (result.error) {
        console.error("SimpleLoginPage: Login failed:", result.error);
        
        let errorMessage = "Login failed";
        if (result.error.message) {
          if (result.error.message.includes('Invalid login credentials')) {
            errorMessage = "Invalid email or password";
          } else if (result.error.message.includes('Email not confirmed')) {
            errorMessage = "Please check your email and confirm your account";
          } else if (result.error.message.includes('Too many requests')) {
            errorMessage = "Too many login attempts. Please try again later";
          } else {
            errorMessage = result.error.message;
          }
        }
        
        setLoginError(errorMessage);
        toast.error(errorMessage);
        setIsSubmitting(false);
      } else {
        console.log("SimpleLoginPage: Login successful");
        toast.success("Login successful!");
        // Don't set isSubmitting false here - let the redirect happen
      }
    } catch (err) {
      console.error("SimpleLoginPage: Unexpected error:", err);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setLoginError(errorMessage);
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };
  
  // Show loading during initialization
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Loading GleeWorld...</p>
        </div>
      </div>
    );
  }
  
  // Show redirecting message for authenticated users
  if (isAuthenticated && user) {
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
      
      {/* Login form container */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/70 dark:bg-black/50 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-white/20 dark:border-white/10">
          <Card className="w-full border-0 bg-transparent shadow-none">
            <CardHeader className="space-y-1 text-center px-0">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Spelman Glee Club Portal
              </CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Enter your credentials to sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md">
                    {loginError}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    required
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password" className="text-gray-900 dark:text-gray-100">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-glee-purple hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 pr-10"
                      required
                      disabled={isSubmitting}
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-glee-spelman hover:bg-glee-spelman/90 text-white" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm">
                <span className="text-gray-700 dark:text-gray-300">Don't have an account? </span>
                <Link to="/signup" className="text-glee-purple hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 px-0">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/85 dark:bg-black/65 px-2 text-gray-600 dark:text-gray-400">Or</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-900/50 hover:bg-white/70 dark:hover:bg-gray-800/70" asChild>
                <Link to="/signup">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Request Member Access
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimpleLoginPage;
