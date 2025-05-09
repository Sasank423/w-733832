import { useState } from 'react';
import { MemeDraft } from '@/pages/MemeCreationStudio';
import { useDrafts } from '@/hooks/useDrafts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, Trash2, Clock, FileText, Edit, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DraftManagerProps {
  currentDraft: MemeDraft;
  onLoadDraft: (draft: MemeDraft) => void;
  onSaveDraft: (draft: MemeDraft, title: string, draftId?: string) => void;
}

export const DraftManager = ({ currentDraft, onLoadDraft, onSaveDraft }: DraftManagerProps) => {
  const { drafts, isLoading, error, saveDraft, deleteDraft } = useDrafts();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('save');
  const [draftTitle, setDraftTitle] = useState('');
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);

  const handleSaveDraft = async () => {
    const title = draftTitle.trim() || 'Untitled Draft';
    const result = await saveDraft(currentDraft, title, selectedDraftId || undefined);
    if (result) {
      setIsOpen(false);
      setDraftTitle('');
      setSelectedDraftId(null);
    }
  };

  const handleLoadDraft = (draft: MemeDraft & { id: string }) => {
    onLoadDraft(draft);
    setIsOpen(false);
  };

  const handleDeleteDraft = async (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    await deleteDraft(draftId);
  };

  const handleEditDraft = (draft: MemeDraft & { id: string, title: string }, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    setActiveTab('save');
    setDraftTitle(draft.title);
    setSelectedDraftId(draft.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Drafts
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Meme Drafts</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="save" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="save">Save Draft</TabsTrigger>
            <TabsTrigger value="load">Load Draft</TabsTrigger>
          </TabsList>
          
          <TabsContent value="save" className="space-y-4 py-4">
            <div>
              <Input
                placeholder="Draft title"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="mb-4"
              />
              {selectedDraftId && (
                <div className="text-sm text-muted-foreground mb-4 flex items-center">
                  <span>Updating existing draft</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 ml-2 p-0" 
                    onClick={() => {
                      setSelectedDraftId(null);
                      setDraftTitle('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Button onClick={handleSaveDraft} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {selectedDraftId ? 'Update Draft' : 'Save New Draft'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="load" className="py-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="cursor-pointer">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="pb-2">
                      <Skeleton className="h-3 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Error loading drafts</p>
                <p className="text-sm">{error.message}</p>
              </div>
            ) : drafts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No saved drafts found</p>
                <p className="text-sm">Save your first draft to see it here</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {drafts.map((draft) => (
                    <Card 
                      key={draft.id} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleLoadDraft(draft)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                          <span className="truncate">{draft.title}</span>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0"
                              onClick={(e) => handleEditDraft(draft, e)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={(e) => handleDeleteDraft(draft.id, e)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>Last saved {formatDistanceToNow(draft.lastSaved)} ago</span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 pb-2">
                        <div className="text-xs text-muted-foreground">
                          {draft.textCaptions.length} caption{draft.textCaptions.length !== 1 ? 's' : ''} • 
                          {draft.imageUrls?.length || 0} image{(draft.imageUrls?.length || 0) !== 1 ? 's' : ''}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DraftManager;
