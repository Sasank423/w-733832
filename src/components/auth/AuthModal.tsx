
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView: 'login' | 'signup';
}

const AuthModal = ({ isOpen, onClose, initialView }: AuthModalProps) => {
  const [view, setView] = useState<'login' | 'signup'>(initialView);
  const { isAuthenticated } = useAuth();
  
  // Automatically close modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {view === 'login' ? 'Welcome back!' : 'Create an account'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {view === 'login' ? (
            <LoginForm onSwitchToSignup={() => setView('signup')} />
          ) : (
            <SignupForm onSwitchToLogin={() => setView('login')} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
