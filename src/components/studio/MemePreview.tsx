
import { MemeDraft } from '@/pages/MemeCreationStudio';
import { Card } from '@/components/ui/card';

interface MemePreviewProps {
  meme: MemeDraft;
}

const MemePreview = ({ meme }: MemePreviewProps) => {
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

  return (
    <div className="relative max-w-md mx-auto">
      <Card className="overflow-hidden">
        <div className="relative">
          {/* The meme image */}
          <img 
            src={meme.imageUrl} 
            alt="Meme template" 
            className="w-full h-auto object-contain max-h-[500px]"
            style={{ filter: filterString }}
          />
          
          {/* Top caption */}
          {meme.topCaption && (
            <div 
              className="absolute top-2 left-0 w-full px-4 py-2 break-words"
              style={{
                textAlign: meme.alignment,
                textShadow: meme.textShadow ? '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' : 'none',
                fontFamily: meme.fontFamily,
                fontSize: `${meme.fontSize}px`,
                color: meme.textColor,
                fontWeight: 'bold',
                lineHeight: '1.2',
                wordBreak: 'break-word',
              }}
            >
              {meme.topCaption}
            </div>
          )}
          
          {/* Bottom caption */}
          {meme.bottomCaption && (
            <div 
              className="absolute bottom-2 left-0 w-full px-4 py-2 break-words"
              style={{
                textAlign: meme.alignment,
                textShadow: meme.textShadow ? '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' : 'none',
                fontFamily: meme.fontFamily,
                fontSize: `${meme.fontSize}px`,
                color: meme.textColor,
                fontWeight: 'bold',
                lineHeight: '1.2',
                wordBreak: 'break-word',
              }}
            >
              {meme.bottomCaption}
            </div>
          )}
          
          {/* Additional captions */}
          {meme.additionalCaptions.map((caption, index) => (
            <div
              key={index}
              className="absolute break-words px-2"
              style={{
                top: `${caption.position.y}%`,
                left: `${caption.position.x}%`,
                transform: 'translate(-50%, -50%)',
                textAlign: meme.alignment,
                textShadow: meme.textShadow ? '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' : 'none',
                fontFamily: meme.fontFamily,
                fontSize: `${meme.fontSize}px`,
                color: meme.textColor,
                fontWeight: 'bold',
                maxWidth: '80%',
                wordBreak: 'break-word',
              }}
            >
              {caption.text}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MemePreview;
