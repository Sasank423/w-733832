import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types/database';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    let mounted = true;
    let isInitialCheck = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          console.log('useAuth: Auth state changed:', { event, hasSession: !!session, isInitialCheck });
          
          // Skip automatic sign-in on initial load
          if (isInitialCheck && event === 'SIGNED_IN') {
            console.log('useAuth: Skipping automatic sign-in on initial load');
            isInitialCheck = false;
            return;
          }
          
          if (event === 'SIGNED_OUT') {
            console.log('useAuth: User signed out, clearing states');
            setSession(null);
            setUser(null);
            setProfile(null);
            navigate('/');
          } else {
            console.log('useAuth: Setting session and user');
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
              try {
                console.log('useAuth: Fetching user profile');
                const { data, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();

                if (error) {
                  console.error('useAuth: Error fetching profile:', error);
                  return;
                }

                if (mounted) {
                  console.log('useAuth: Setting user profile');
                  setProfile(data);
                }
              } catch (error) {
                console.error('useAuth: Error fetching profile:', error);
              }
            }
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (mounted) {
        console.log('useAuth: Initial session check:', { hasSession: !!session });
        
        // Only set the session if it's not an automatic sign-in
        if (!isInitialCheck) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            try {
              console.log('useAuth: Fetching initial user profile');
              const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (error) {
                console.error('useAuth: Error fetching initial profile:', error);
                return;
              }

              if (mounted) {
                console.log('useAuth: Setting initial user profile');
                setProfile(data);
              }
            } catch (error) {
              console.error('useAuth: Error fetching initial profile:', error);
            }
          }
        }
        
        setIsLoading(false);
        isInitialCheck = false;
      }
    });

    return () => {
      console.log('useAuth: Cleaning up auth state listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    console.log('useAuth: Starting login process');
    setIsLoading(true);
    
    try {
      // Clear any existing session first
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('useAuth: Login failed:', error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log('useAuth: Login successful');
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
    } catch (error) {
      console.error('useAuth: Login error:', error);
      throw error;
    } finally {
      console.log('useAuth: Login process completed');
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Account created",
        description: "Welcome to ImageGenHub!",
      });
      
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // States will be cleared by the auth state listener
      navigate('/');
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setProfile(data);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    profile,
    session,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
