import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const ProfileSettings = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(profile?.avatar);
  const { toast } = useToast();
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      email: user?.email || '',
      bio: profile?.bio || '',
    },
  });
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      setIsProfileUpdating(true);
      // In a real app, this would call an API endpoint to update the profile
      console.log('Profile data to update:', data);
      
      if (avatarFile) {
        // In a real app, this would upload the avatar file to a storage service
        console.log('Avatar file to upload:', avatarFile);
      }
      
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProfileUpdating(false);
    }
  };
  
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      setIsPasswordUpdating(true);
      // In a real app, this would call an API endpoint to update the password
      console.log('Password data to update:', data);
      
      toast({
        title: "Success",
        description: "Your password has been updated.",
      });
      
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not update your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordUpdating(false);
    }
  };
  
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container-layout py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You need to be logged in to access this page.</p>
          <Button className="mt-4" asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-layout py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
          
          <Tabs defaultValue="profile">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
              <TabsTrigger value="password" className="flex-1">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback className="bg-brand-purple text-white text-xl">
                      {profile?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <input
                      type="file"
                      id="avatar"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('avatar')?.click()}
                    >
                      Change Avatar
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium mb-1">
                      Username
                    </label>
                    <Input
                      id="username"
                      {...profileForm.register('username')}
                      disabled={isProfileUpdating}
                      className={profileForm.formState.errors.username ? 'border-red-500' : ''}
                    />
                    {profileForm.formState.errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register('email')}
                      disabled={isProfileUpdating}
                      className={profileForm.formState.errors.email ? 'border-red-500' : ''}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      {...profileForm.register('bio')}
                      className="w-full px-3 py-2 border rounded-md resize-none h-24"
                      disabled={isProfileUpdating}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isProfileUpdating}>
                    {isProfileUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="password">
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                      Current Password
                    </label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...passwordForm.register('currentPassword')}
                      disabled={isPasswordUpdating}
                      className={passwordForm.formState.errors.currentPassword ? 'border-red-500' : ''}
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                      New Password
                    </label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...passwordForm.register('newPassword')}
                      disabled={isPasswordUpdating}
                      className={passwordForm.formState.errors.newPassword ? 'border-red-500' : ''}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...passwordForm.register('confirmPassword')}
                      disabled={isPasswordUpdating}
                      className={passwordForm.formState.errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isPasswordUpdating}>
                    {isPasswordUpdating ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSettings;
