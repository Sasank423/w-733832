
import { useState } from 'react';
import { MemeDraft } from '@/pages/MemeCreationStudio';
import { Card } from '@/components/ui/card';
import { Move } from 'lucide-react';

interface MemePreviewProps {
  meme: MemeDraft;
  onUpdateCaption?: (id: string, updates: { position: { x: number; y: number } }) => void;
  isEditing?: boolean;
}

const MemePreview = ({ meme, onUpdateCaption, isEditing = true }: MemePreviewProps) => {
  const [activeCaption, setActiveCaption] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // If no image is selected, show a placeholder
  if (!meme.imageUrl) {
    return (
      <div className="w-full aspect-square bg-muted flex items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">Select an image to create your meme</p>
      </div>
    );
  }

  // Calculate filter string for CSS
  const filterString = `brightness(${meme.filter.brightness}%) contrast(${meme.filter.contrast}%) saturate(${meme.filter.saturation}%)`;

  const handleMouseDown = (e: React.MouseEvent, captionId: string) => {
    if (!isEditing || !onUpdateCaption) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setActiveCaption(captionId);

    e.preventDefault(); // Prevent text selection during drag
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activeCaption || !isEditing || !onUpdateCaption) return;

    const containerRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    
    // Calculate new position as percentages relative to the container
    const newX = ((e.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100;
    const newY = ((e.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;
    
    // Constrain values to stay within the container
    const clampedX = Math.max(0, Math.min(100, newX));
    const clampedY = Math.max(0, Math.min(100, newY));

    onUpdateCaption(activeCaption, { 
      position: { x: clampedX, y: clampedY }
    });
  };

  const handleMouseUp = () => {
    setActiveCaption(null);
  };

  const handleMouseLeave = () => {
    setActiveCaption(null);
  };

  return (
    <div className="relative max-w-md mx-auto">
      <Card className="overflow-hidden">
        <div 
          className="relative"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* The meme image */}
          <img 
            src={meme.imageUrl} 
            alt="Meme template" 
            className="w-full h-auto object-contain max-h-[500px]"
            style={{ filter: filterString }}
          />

          {/* Draggable captions */}
          {meme.textCaptions.map((caption) => (
            <div
              key={caption.id}
              className={`absolute cursor-move break-words px-2 ${
                activeCaption === caption.id ? 'z-10 ring-2 ring-brand-purple' : ''
              }`}
              style={{
                top: `${caption.position.y}%`,
                left: `${caption.position.x}%`,
                transform: 'translate(-50%, -50%)',
                textShadow: meme.textShadow ? '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' : 'none',
                fontFamily: caption.fontFamily || meme.fontFamily,
                fontSize: `${caption.fontSize || meme.fontSize}px`,
                color: caption.color || meme.textColor,
                fontWeight: 'bold',
                maxWidth: '80%',
                wordBreak: 'break-word',
              }}
              onMouseDown={(e) => handleMouseDown(e, caption.id)}
            >
              {caption.text}
              {isEditing && onUpdateCaption && (
                <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-background rounded-full p-1 opacity-70 hover:opacity-100">
                  <Move className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MemePreview;
