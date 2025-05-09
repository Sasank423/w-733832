import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useDrafts } from '@/hooks/useDrafts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Trash2, Clock, Plus, Search, ArrowRight } from 'lucide-react';

const DraftDashboard = () => {
  // Use protected route hook to redirect if not authenticated
  const { isAuthenticated } = useProtectedRoute();
  const navigate = useNavigate();
  const { drafts, isLoading, error, deleteDraft } = useDrafts();
  const [searchQuery, setSearchQuery] = useState('');
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

  // Filter drafts based on search query
  const filteredDrafts = drafts.filter(draft => 
    draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.textCaptions.some(caption => 
      caption.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEditDraft = (draftId: string) => {
    navigate(`/create/draft/${draftId}`);
  };

  const handleDeleteDraft = async () => {
    if (draftToDelete) {
      await deleteDraft(draftToDelete);
      setDraftToDelete(null);
    }
  };

  const handleCreateNew = () => {
    navigate('/create');
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Meme Drafts</h1>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" /> Create New Meme
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="pb-2">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter className="pt-0">
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p className="text-xl font-semibold">Error loading drafts</p>
            <p>{error.message}</p>
          </div>
        ) : filteredDrafts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery ? (
              <>
                <p className="text-xl font-semibold">No drafts match your search</p>
                <p>Try a different search term or clear the search</p>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold">No saved drafts found</p>
                <p>Create your first meme draft to see it here</p>
                <Button className="mt-4" onClick={handleCreateNew}>
                  <Plus className="mr-2 h-4 w-4" /> Create New Meme
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrafts.map((draft) => (
              <Card key={draft.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{draft.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>Last saved {formatDistanceToNow(draft.lastSaved)} ago</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-sm text-muted-foreground mb-2">
                    {draft.textCaptions.length} caption{draft.textCaptions.length !== 1 ? 's' : ''} • 
                    {draft.imageUrls?.length || 0} image{(draft.imageUrls?.length || 0) !== 1 ? 's' : ''}
                  </div>
                  {draft.imageUrls && draft.imageUrls.length > 0 && (
                    <div className="relative h-32 bg-muted/30 rounded-md overflow-hidden">
                      <img 
                        src={draft.imageUrls[0]} 
                        alt={draft.title} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <Button 
                    variant="outline" 
                    className="flex-1 mr-2"
                    onClick={() => handleEditDraft(draft.id)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <AlertDialog open={draftToDelete === draft.id} onOpenChange={(open) => !open && setDraftToDelete(null)}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => setDraftToDelete(draft.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this draft. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteDraft} className="bg-red-500 hover:bg-red-600">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DraftDashboard;
