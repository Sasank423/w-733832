import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      console.log('LoginForm: Starting login process');
      setIsLoading(true);
      await login(data.email, data.password);
      console.log('LoginForm: Login successful');
    } catch (error: any) {
      console.error('LoginForm: Login failed:', error);
      toast({
        title: "Error",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log('LoginForm: Login process completed, setting loading to false');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          {...register('password')}
          className={errors.password ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      
      <div className="text-right">
        <Button variant="link" type="button" className="p-0 h-auto text-sm">
          Forgot password?
        </Button>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : 'Log in'}
      </Button>
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Button 
            variant="link" 
            className="p-0 h-auto" 
            onClick={onSwitchToSignup}
            disabled={isLoading}
          >
            Sign up
          </Button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
