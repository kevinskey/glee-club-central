
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Music, Heart, Star, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function JoinGleeFamPage() {
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/fan-dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await signUp(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName
      );

      if (error) {
        setError(error.message);
      } else {
        toast.success('Welcome to the Glee Fam! Please check your email to verify your account.');
        navigate('/fan-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-glee-spelman/10 via-background to-glee-purple/10 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Benefits */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-glee-spelman to-glee-purple bg-clip-text text-transparent mb-4">
              Join the Glee Fam!
            </h1>
            <p className="text-lg text-muted-foreground">
              Become part of our musical family and get exclusive access to content, events, and more!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-glee-spelman/20">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-glee-spelman mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Event Updates</h3>
                <p className="text-sm text-muted-foreground">Never miss a performance</p>
              </CardContent>
            </Card>

            <Card className="border-glee-purple/20">
              <CardContent className="p-4 text-center">
                <Music className="h-8 w-8 text-glee-purple mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Exclusive Content</h3>
                <p className="text-sm text-muted-foreground">Behind-the-scenes access</p>
              </CardContent>
            </Card>

            <Card className="border-glee-spelman/20">
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Community</h3>
                <p className="text-sm text-muted-foreground">Connect with other fans</p>
              </CardContent>
            </Card>

            <Card className="border-glee-purple/20">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Early Access</h3>
                <p className="text-sm text-muted-foreground">First to know about tickets</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-glee-purple" />
            </div>
            <CardTitle className="text-2xl">Create Your Fan Account</CardTitle>
            <CardDescription>
              Join thousands of fans who stay connected with the Spelman College Glee Club
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-glee-spelman to-glee-purple hover:from-glee-spelman/90 hover:to-glee-purple/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Join the Glee Fam!'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-glee-purple hover:underline">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
