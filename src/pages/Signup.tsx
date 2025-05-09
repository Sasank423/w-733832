
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import SignupForm from '@/components/auth/SignupForm';

const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="flex items-center justify-center mb-8 text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-purple-dark"
        >
          ImageGenHub
        </Link>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to get started with ImageGenHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm onSwitchToLogin={() => navigate('/login')} />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t p-6">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-brand-purple hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
