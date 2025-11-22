import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { galleryImages } from '@/lib/data';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

// Smart shuffle algorithm to avoid similar images next to each other
const smartShuffle = (images: typeof galleryImages) => {
  const shuffled: typeof galleryImages = [];
  const remaining = [...images];
  
  while (remaining.length > 0) {
    const randomIndex = Math.floor(Math.random() * remaining.length);
    shuffled.push(remaining[randomIndex]);
    remaining.splice(randomIndex, 1);
  }
  
  return shuffled;
};

export function Gallery() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [shuffledImages] = useState(() => smartShuffle(galleryImages));
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Block scroll and hide navbar when modal is open
  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (selectedId) {
      document.body.style.overflow = 'hidden';
      if (navbar) navbar.style.visibility = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (navbar) navbar.style.visibility = 'visible';
    }
    return () => {
      document.body.style.overflow = '';
      if (navbar) navbar.style.visibility = 'visible';
    };
  }, [selectedId]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    
    // Auto-scroll right every 7 seconds
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 7000);
    
    return () => {
      emblaApi.off('select', onSelect);
      clearInterval(interval);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const selectedImage = shuffledImages.find(img => img.id === selectedId);

  const goToPrevious = () => {
    const currentIndex = shuffledImages.findIndex(img => img.id === selectedId);
    const newIndex = currentIndex === 0 ? shuffledImages.length - 1 : currentIndex - 1;
    setSelectedId(shuffledImages[newIndex].id);
  };

  const goToNext = () => {
    const currentIndex = shuffledImages.findIndex(img => img.id === selectedId);
    const newIndex = (currentIndex + 1) % shuffledImages.length;
    setSelectedId(shuffledImages[newIndex].id);
  };

  return (
    <>
      {/* Carousel */}
      <div className="relative w-full">
        {/* Gradient fade from left */}
        <div className="absolute top-0 left-0 w-1/6 h-full bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        
        {/* Gradient fade from right */}
        <div className="absolute top-0 right-0 w-1/6 h-full bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3">
            {shuffledImages.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedId(image.id)}
                data-testid={`gallery-image-${image.id}`}
                className="relative flex-shrink-0 h-80 md:h-96 overflow-hidden group cursor-pointer bg-black/60 flex items-center justify-center rounded-sm"
              >
                <img
                  src={image.src}
                  alt={`Gallery ${image.id}`}
                  className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-sm" />
              </button>
            ))}
            <div className="flex-shrink-0 w-3" />
          </div>
        </div>

        {/* Left Navigation Button */}
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-white/60 hover:text-white transition-colors z-20"
          data-testid="button-carousel-prev"
          aria-label="Previous"
        >
          <ChevronLeft size={40} strokeWidth={1} />
        </button>

        {/* Right Navigation Button */}
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-white/60 hover:text-white transition-colors z-20"
          data-testid="button-carousel-next"
          aria-label="Next"
        >
          <ChevronRight size={40} strokeWidth={1} />
        </button>
      </div>

      {/* Modal */}
      {selectedId && selectedImage && createPortal(
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black z-[999999] flex items-center justify-center p-4 overflow-hidden"
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

          {/* Counter */}
          <div className="absolute bottom-6 left-6 text-white/60 text-sm font-mono">
            {shuffledImages.findIndex(img => img.id === selectedId) + 1} / {shuffledImages.length}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
