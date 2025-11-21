import { useState, useEffect } from 'react';
import { galleryImages } from '@/lib/data';
import { ChevronLeft, ChevronRight, X, ChevronDown, ChevronUp } from 'lucide-react';

export function Gallery() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [shuffledImages, setShuffledImages] = useState(galleryImages);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const INITIAL_COUNT = 18; // ~2-3 rows worth of images
  const displayedImages = isExpanded ? shuffledImages : shuffledImages.slice(0, INITIAL_COUNT);
  
  // Shuffle images on mount
  useEffect(() => {
    const shuffled = [...galleryImages].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, []);

  // Block scroll when modal is open
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedId]);
  
  const selectedImage = shuffledImages.find(img => img.id === selectedId);
  const selectedIndex = selectedId ? shuffledImages.findIndex(img => img.id === selectedId) : -1;

  const goToPrevious = () => {
    if (selectedIndex > 0) {
      setSelectedId(shuffledImages[selectedIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (selectedIndex < shuffledImages.length - 1) {
      setSelectedId(shuffledImages[selectedIndex + 1].id);
    }
  };

  return (
    <>
      {/* Gallery Masonry - Pinterest Style */}
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
        {displayedImages.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedId(image.id)}
            data-testid={`gallery-image-${image.id}`}
            className="relative overflow-hidden group cursor-pointer bg-black/60 flex items-center justify-center break-inside-avoid-column rounded-sm"
          >
            <img
              src={image.src}
              alt={`Gallery ${image.id}`}
              className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-sm" />
          </button>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      {shuffledImages.length > INITIAL_COUNT && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-8 py-4 px-6 border border-white/20 hover:border-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-2 font-mono text-sm tracking-widest text-white/80 hover:text-primary"
          data-testid="button-expand-gallery"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={18} />
              СВЕРНУТЬ
            </>
          ) : (
            <>
              <ChevronDown size={18} />
              ПОКАЗАТЬ ВСЕ ({shuffledImages.length})
            </>
          )}
        </button>
      )}

      {/* Modal */}
      {selectedId && selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[999999] flex items-center justify-center p-4"
          onClick={() => setSelectedId(null)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'Escape') setSelectedId(null);
          }}
          tabIndex={0}
          role="dialog"
          aria-label="Gallery lightbox"
          data-testid="gallery-modal"
        >
          <button
            onClick={() => setSelectedId(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-[1000000]"
            data-testid="button-close-modal"
            aria-label="Close"
          >
            <X size={32} strokeWidth={1.5} />
          </button>

          {/* Image Container */}
          <div
            className="w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={`Gallery ${selectedImage.id}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Navigation */}
          {selectedIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              data-testid="button-previous-image"
              aria-label="Previous image"
            >
              <ChevronLeft size={40} strokeWidth={1} />
            </button>
          )}

          {selectedIndex < shuffledImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              data-testid="button-next-image"
              aria-label="Next image"
            >
              <ChevronRight size={40} strokeWidth={1} />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-6 left-6 text-white/60 text-sm font-mono">
            {selectedIndex + 1} / {shuffledImages.length}
          </div>
        </div>
      )}
    </>
  );
}
