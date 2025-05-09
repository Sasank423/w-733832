import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flag, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion } from '@/components/ui/motion';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useComments, useAddCommentMutation } from '@/hooks/useComments';

interface CommentSidebarProps {
  memeId: string;
  onClose: () => void;
}

const CommentSidebar = ({ memeId, onClose }: CommentSidebarProps) => {
  const [commentText, setCommentText] = useState('');
  const [remainingChars, setRemainingChars] = useState(140);
  const { user, profile, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const { data: comments = [], isLoading } = useComments(memeId);
  const addCommentMutation = useAddCommentMutation();
  const queryClient = useQueryClient();
  const MAX_CHARS = 140;
  
  // Setup real-time updates for comments
  useEffect(() => {
    // Subscribe to changes on the comments table for this specific meme
    const subscription = supabase
      .channel(`comments-channel-${memeId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'comments',
        filter: `meme_id=eq.${memeId}`
      }, (payload) => {
        // When a comment is added, updated, or deleted, refresh the comments
        queryClient.invalidateQueries({ queryKey: ['comments', memeId] });
        
        // Also refresh the meme data to get accurate counts
        queryClient.invalidateQueries({ queryKey: ['meme', memeId] });
        queryClient.invalidateQueries({ queryKey: ['meme-feed'] });
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [memeId, queryClient]);
  
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setCommentText(text);
      setRemainingChars(MAX_CHARS - text.length);
    }
  };
  
  const handleSubmitComment = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to comment.",
        variant: "destructive",
      });
      return;
    }
    if (!commentText.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before submitting.",
        variant: "destructive",
      });
      return;
    }
    addCommentMutation.mutate(
      { memeId, text: commentText.trim() },
      {
        onSuccess: () => {
          setCommentText('');
          setRemainingChars(MAX_CHARS);
        }
      }
    );
  };
  
  const handleFlagComment = (commentId: string) => {
    toast({
      title: "Comment reported",
      description: "Thank you for helping keep our community safe. We'll review this comment.",
    });
  };
  
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - commentTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else if (diffInSeconds < 604800) { // 7 days
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } else {
      return new Date(timestamp).toLocaleDateString();
    }
  };
  
  return (
    <Card className="flex flex-col w-full mx-auto max-w-[400px] border border-gray-200 dark:border-gray-800 shadow-lg h-[70vh] max-h-[70vh] relative top-0 right-0 bg-card">
      <CardHeader className="flex-row justify-between items-center py-2 px-3 border-b">
        <h3 className="text-base font-semibold">Comments ({isLoading ? '...' : comments.length})</h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-[calc(70vh-120px)] max-h-[calc(70vh-120px)]">
          <div className="p-3 space-y-2">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment: any, index: number) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: index < 3 ? 1 : 0, y: index < 3 ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index < 3 ? 0 : index * 0.1 }}
                  className="border-b pb-4 last:border-0"
                >
                  <div className="flex space-x-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={comment.user?.avatar} />
                      <AvatarFallback className="bg-brand-purple text-white">
                        {comment.user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Link to={`/user/${comment.user?.id}`} className="font-medium hover:underline">
                            {comment.user?.username}
                          </Link>
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(comment.created_at)}
                          </span>
                        </div>
                        
                        {isAuthenticated && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0" 
                            onClick={() => handleFlagComment(comment.id)}
                          >
                            <Flag className="h-4 w-4" />
                            <span className="sr-only">Flag comment</span>
                          </Button>
                        )}
                      </div>
                      
                      <p className="mt-1 text-gray-700 dark:text-gray-300">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-3 border-t">
        <div className="w-full space-y-1">
          <Textarea
            ref={commentInputRef}
            placeholder={isAuthenticated ? "Add a comment..." : "Log in to comment"}
            value={commentText}
            onChange={handleCommentChange}
            className="min-h-[60px] w-full text-sm"
            disabled={!isAuthenticated || addCommentMutation.isPending}
          />
          
          <div className="flex items-center justify-between">
            <span className={`text-xs ${remainingChars < 20 ? 'text-red-500' : 'text-gray-500'}`}>
              {remainingChars} characters remaining
            </span>
            
            <Button 
              onClick={handleSubmitComment} 
              disabled={!commentText.trim() || addCommentMutation.isPending || !isAuthenticated}
              size="sm"
            >
              {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
          
          {!isAuthenticated && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              <Link to="/login" className="text-brand-purple hover:underline">Log in</Link> or <Link to="/signup" className="text-brand-purple hover:underline">sign up</Link> to join the conversation.
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CommentSidebar;
