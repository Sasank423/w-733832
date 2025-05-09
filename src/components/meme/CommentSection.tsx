
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Flag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion } from '@/components/ui/motion';
import { Link } from 'react-router-dom';
import { useComments, useAddCommentMutation, useDeleteCommentMutation } from '@/hooks/useComments';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentSectionProps {
  memeId: string;
}

const CommentSection = ({ memeId }: CommentSectionProps) => {
  const [commentText, setCommentText] = useState('');
  const [remainingChars, setRemainingChars] = useState(140);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  
  const { data: comments, isLoading } = useComments(memeId);
  const addCommentMutation = useAddCommentMutation();
  const deleteCommentMutation = useDeleteCommentMutation();
  
  const MAX_CHARS = 140;
  
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
  
  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate({ commentId, memeId });
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
    <div className="comments-section">
      <h3 className="text-xl font-bold mb-6">
        Comments ({isLoading ? '...' : comments?.length || 0})
      </h3>
      
      {/* Comment input area */}
      <div className="mb-6">
        <Textarea
          ref={commentInputRef}
          placeholder={isAuthenticated ? "Add a comment..." : "Log in to comment"}
          value={commentText}
          onChange={handleCommentChange}
          className="min-h-[80px] mb-2"
          disabled={!isAuthenticated || addCommentMutation.isPending}
        />
        
        <div className="flex items-center justify-between">
          <span className={`text-xs ${remainingChars < 20 ? 'text-red-500' : 'text-gray-500'}`}>
            {remainingChars} characters remaining
          </span>
          
          <Button 
            onClick={handleSubmitComment} 
            disabled={!commentText.trim() || addCommentMutation.isPending || !isAuthenticated}
          >
            {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
        
        {!isAuthenticated && (
          <p className="text-sm text-gray-500 mt-2">
            <Link to="/auth" className="text-brand-purple hover:underline">Log in</Link> or <Link to="/auth" className="text-brand-purple hover:underline">sign up</Link> to join the conversation.
          </p>
        )}
      </div>
      
      {/* Comments list */}
      <div className="space-y-6">
        {isLoading ? (
          // Loading skeleton
          [...Array(3)].map((_, index) => (
            <div key={index} className="border-b pb-4 last:border-0">
              <div className="flex space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </div>
              </div>
            </div>
          ))
        ) : comments?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments?.map((comment: any, index) => (
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
                    {comment.user?.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Link to={`/profile/${comment.user?.id}`} className="font-medium hover:underline">
                        {comment.user?.username}
                      </Link>
                      <span className="text-xs text-gray-500">
                        {getTimeAgo(comment.created_at)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      {isAuthenticated && user?.id === comment.user_id && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deleteCommentMutation.isPending}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                          </svg>
                          <span className="sr-only">Delete</span>
                        </Button>
                      )}
                      
                      {isAuthenticated && user?.id !== comment.user_id && (
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
    </div>
  );
};

export default CommentSection;
