import { useState } from 'react';
import { Eye, MessageSquare, Heart, Pen, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

interface MemeStatsProps {
  meme: {
    id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
    voteCount: number;
    stats?: {
      views?: number;
      comments?: number;
    };
  };
  onDelete?: (memeId: string) => void;
  onEdit?: (memeId: string) => void;
}

const MemeStats = ({ meme, onDelete, onEdit }: MemeStatsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(meme.id);
    }
    
    setShowDeleteDialog(false);
    toast({
      title: "Meme deleted",
      description: "Your meme has been successfully deleted."
    });
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(meme.id);
    }
  };

  return (
    <div className="flex flex-col md:flex-row border rounded-lg p-4 gap-4">
      <div className="md:w-32 w-full h-32 flex-shrink-0">
        <img 
          src={meme.imageUrl} 
          alt={meme.title}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <span className="text-lg font-medium">{meme.title}</span>
          <span className="text-sm text-gray-500">{new Date(meme.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 my-3">
          <div className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
            <div className="flex items-center text-sm gap-1">
              <Heart className="h-4 w-4 text-brand-purple" />
              <span className="font-medium">{meme.voteCount}</span>
            </div>
            <span className="text-xs text-gray-500">Votes</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
            <div className="flex items-center text-sm gap-1">
              <MessageSquare className="h-4 w-4 text-amber-500" />
              <span className="font-medium">{meme.stats?.comments || 0}</span>
            </div>
            <span className="text-xs text-gray-500">Comments</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
            <div className="flex items-center text-sm gap-1">
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{meme.stats?.views || 0}</span>
            </div>
            <span className="text-xs text-gray-500">Views</span>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleEdit}>
            <Pen className="h-3 w-3" />
            <span>Edit Caption</span>
          </Button>
          
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex items-center gap-1">
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the meme. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default MemeStats;
