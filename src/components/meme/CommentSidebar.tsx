import { useState, useRef } from 'react';
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
    <Card className="h-full flex flex-col max-w-[500px] w-full mx-auto">
      <CardHeader className="flex-row justify-between items-center py-3 border-b">
        <h3 className="text-lg font-semibold">Comments ({isLoading ? '...' : comments.length})</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="p-4 space-y-4">
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
      
      <CardFooter className="p-4 border-t">
        <div className="w-full space-y-2">
          <Textarea
            ref={commentInputRef}
            placeholder={isAuthenticated ? "Add a comment..." : "Log in to comment"}
            value={commentText}
            onChange={handleCommentChange}
            className="min-h-[80px] w-full"
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
