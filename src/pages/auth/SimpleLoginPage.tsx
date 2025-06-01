
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Music, LogIn, Eye, EyeOff } from 'lucide-react';
import { PageLoader } from '@/components/ui/page-loader';
import { toast } from 'sonner';

export default function SimpleLoginPage() {
  const { login, isAuthenticated, isLoading, isInitialized } = useSimpleAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get any message from location state (e.g., from registration)
  const locationMessage = location.state?.message;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      navigate('/role-dashboard');
    }
  }, [isAuthenticated, isInitialized, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('🔐 SimpleLoginPage: Login attempt for:', email);
      const { error: loginError } = await login(email, password);
      
      if (loginError) {
        console.error('❌ SimpleLoginPage: Login error:', loginError);
        let errorMessage = 'Login failed';
        
        if (loginError.message) {
          if (loginError.message.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          } else if (loginError.message.includes('Email not confirmed')) {
            errorMessage = 'Please check your email and click the verification link before signing in.';
          } else {
            errorMessage = loginError.message;
          }
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        console.log('✅ SimpleLoginPage: Login successful');
        toast.success('Welcome back!');
        // Navigation is handled by the auth state change
      }
    } catch (err: any) {
      console.error('💥 SimpleLoginPage: Unexpected login error:', err);
      const errorMessage = 'An unexpected error occurred during login';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking auth
  if (!isInitialized || (isAuthenticated && isLoading)) {
    return (
      <PageLoader 
        message="Checking authentication..." 
        className="min-h-screen"
      />
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
      
      {/* Login form container */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-white/20 dark:border-white/10">
          <Card className="w-full border-0 bg-transparent shadow-none">
            <CardHeader className="space-y-1 text-center px-0">
              <div className="flex justify-center mb-4">
                <Music className="h-12 w-12 text-glee-purple" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Welcome to Glee World
              </CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Sign in to access your member dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-0">
              {/* Show message from registration or other sources */}
              {locationMessage && (
                <Alert className="mb-4">
                  <AlertDescription className="text-sm">
                    {locationMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-900 dark:text-gray-100">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 pr-10"
                      required
                      disabled={isSubmitting}
                      placeholder="••••••••"
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
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-glee-purple hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                
                <div className="text-center text-sm border-t pt-4">
                  <span className="text-gray-700 dark:text-gray-300">Don't have an account? </span>
                  <Link to="/signup" className="text-glee-purple hover:underline font-medium">
                    Sign up here
                  </Link>
                </div>
                
                <div className="text-center text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Want to join as a fan? </span>
                  <Link to="/join-glee-fam" className="text-glee-purple hover:underline font-medium">
                    Join the Glee Fam
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
