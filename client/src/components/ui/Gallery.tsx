import { useState } from 'react';
import { galleryImages } from '@/lib/data';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export function Gallery() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const selectedImage = galleryImages.find(img => img.id === selectedId);
  const selectedIndex = selectedId ? galleryImages.findIndex(img => img.id === selectedId) : -1;

  const goToPrevious = () => {
    if (selectedIndex > 0) {
      setSelectedId(galleryImages[selectedIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (selectedIndex < galleryImages.length - 1) {
      setSelectedId(galleryImages[selectedIndex + 1].id);
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {galleryImages.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedId(image.id)}
            data-testid={`gallery-image-${image.id}`}
            className="relative overflow-hidden aspect-square group cursor-pointer"
          >
            <img
              src={image.src}
              alt={`Gallery ${image.id}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedId && selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-50"
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

          {selectedIndex < galleryImages.length - 1 && (
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
            {selectedIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </>
  );
}
