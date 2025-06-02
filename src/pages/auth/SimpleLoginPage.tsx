import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function SimpleLoginPage() {
  const { login, isAuthenticated, isLoading, isInitialized } = useAuth();
  const navigate = useNavigate();
  
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
      console.log('📱 SimpleLoginPage: User agent:', navigator.userAgent);
      console.log('📱 SimpleLoginPage: Screen dimensions:', {
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight
      });
      
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
    <div className="min-h-screen w-full flex items-center justify-center animate-fade-in bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Image - Mobile Optimized */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `url('/lovable-uploads/5d6ba7fa-4ea7-42ac-872e-940fb620a273.png')`,
        }}
      />
      
      {/* Login form container */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <Card className="w-full border-0 bg-transparent shadow-none">
            <CardHeader className="space-y-1 text-center px-0">
              <div className="flex justify-center mb-4">
                <Music className="h-12 w-12 text-blue-600 dark:text-blue-400" />
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
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 h-12"
                    required
                    disabled={isSubmitting}
                    placeholder="your.email@example.com"
                    autoComplete="email"
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
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 h-12 pr-12"
                      required
                      disabled={isSubmitting}
                      placeholder="••••••••"
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
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white" 
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
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Forgot your password?
                  </Link>
                </div>
                
                <div className="text-center text-sm border-t pt-4">
                  <span className="text-gray-700 dark:text-gray-300">Don't have an account? </span>
                  <Link to="/signup" className="text-blue-600 hover:underline font-medium dark:text-blue-400">
                    Sign up here
                  </Link>
                </div>
                
                <div className="text-center text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Want to join as a fan? </span>
                  <Link to="/join-glee-fam" className="text-blue-600 hover:underline font-medium dark:text-blue-400">
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
