import { motion } from "framer-motion";
import { useState } from "react";
import { galleryImages } from "@/lib/data";
import { useLanguage } from "@/hooks/useLanguage";

interface PinItem {
  id: string;
  type: 'photo' | 'text' | 'label';
  content: string | JSX.Element;
  rotation: number;
  scale: number;
  position: { top: string; left: string };
  size?: { width: string; height: string };
}

export function Pinboard() {
  const { language } = useLanguage();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Select some gallery images for the pinboard
  const selectedPhotos = galleryImages.slice(0, 8);

  const pinItems: PinItem[] = [
    // Photos from gallery
    {
      id: 'photo-1',
      type: 'photo',
      content: selectedPhotos[0]?.src || '',
      rotation: -8,
      scale: 0.9,
      position: { top: '5%', left: '8%' },
      size: { width: '180px', height: '220px' }
    },
    {
      id: 'photo-2',
      type: 'photo',
      content: selectedPhotos[1]?.src || '',
      rotation: 12,
      scale: 0.85,
      position: { top: '15%', left: '35%' },
      size: { width: '160px', height: '200px' }
    },
    {
      id: 'photo-3',
      type: 'photo',
      content: selectedPhotos[2]?.src || '',
      rotation: -15,
      scale: 0.95,
      position: { top: '10%', left: '62%' },
      size: { width: '190px', height: '230px' }
    },
    {
      id: 'photo-4',
      type: 'photo',
      content: selectedPhotos[3]?.src || '',
      rotation: 10,
      scale: 0.88,
      position: { top: '45%', left: '12%' },
      size: { width: '170px', height: '210px' }
    },
    {
      id: 'photo-5',
      type: 'photo',
      content: selectedPhotos[4]?.src || '',
      rotation: -12,
      scale: 0.92,
      position: { top: '50%', left: '65%' },
      size: { width: '175px', height: '215px' }
    },
    {
      id: 'photo-6',
      type: 'photo',
      content: selectedPhotos[5]?.src || '',
      rotation: 8,
      scale: 0.87,
      position: { top: '25%', left: '82%' },
      size: { width: '165px', height: '205px' }
    },
    // Text stickers
    {
      id: 'label-1',
      type: 'label',
      content: 'GRAPHIC DESIGN',
      rotation: -20,
      scale: 1,
      position: { top: '42%', left: '42%' },
      size: { width: '160px', height: '70px' }
    },
    {
      id: 'label-2',
      type: 'label',
      content: 'CREATIVE',
      rotation: 15,
      scale: 0.95,
      position: { top: '70%', left: '8%' },
      size: { width: '140px', height: '60px' }
    },
    {
      id: 'label-3',
      type: 'label',
      content: 'EMAIL DESIGN',
      rotation: -10,
      scale: 1,
      position: { top: '72%', left: '55%' },
      size: { width: '160px', height: '70px' }
    },
  ];

  return (
    <section className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100">
      {/* Cork texture background */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, #c19a6b 0%, transparent 2%),
          radial-gradient(circle at 60% 70%, #d4a574 0%, transparent 3%),
          radial-gradient(circle at 30% 30%, #b8956a 0%, transparent 2%),
          radial-gradient(circle at 80% 20%, #c19a6b 0%, transparent 2%)
        `,
        backgroundSize: '200px 200px'
      }} />

      {/* Container for pins */}
      <div className="relative w-full h-full max-w-6xl aspect-video">
        {/* Pin items */}
        {pinItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute cursor-pointer"
            style={{
              top: item.position.top,
              left: item.position.left,
              width: item.size?.width,
              height: item.size?.height,
            }}
            initial={{ opacity: 0, y: 20, rotateZ: item.rotation - 5 }}
            animate={{
              opacity: 1,
              y: 0,
              rotateZ: hoveredId === item.id ? item.rotation - 2 : item.rotation,
              scale: hoveredId === item.id ? item.scale * 1.05 : item.scale
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Pin */}
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-lg z-20 border-2 border-red-600"
              animate={{
                y: hoveredId === item.id ? -8 : 0,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            />

            {item.type === 'photo' ? (
              // Photo card
              <motion.div
                className="w-full h-full rounded-sm overflow-hidden shadow-2xl border-4 border-white bg-white"
                animate={{
                  boxShadow: hoveredId === item.id 
                    ? '0 20px 40px rgba(0,0,0,0.3)' 
                    : '0 10px 25px rgba(0,0,0,0.2)'
                }}
              >
                <img
                  src={typeof item.content === 'string' ? item.content : ''}
                  alt="Gallery"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ) : (
              // Text label/sticker
              <motion.div
                className="w-full h-full flex items-center justify-center rounded-lg font-display font-bold text-center px-2 py-4 shadow-xl border-2 text-black"
                style={{
                  backgroundColor: item.id.includes('label-1')
                    ? '#FFE5B4'
                    : item.id.includes('label-2')
                    ? '#FFD4A3'
                    : '#FFF4E6',
                  borderColor: '#DC7633'
                }}
                animate={{
                  boxShadow: hoveredId === item.id
                    ? '0 15px 35px rgba(0,0,0,0.25)'
                    : '0 8px 20px rgba(0,0,0,0.15)'
                }}
              >
                <span className="text-xs md:text-sm lg:text-base leading-tight">
                  {item.content}
                </span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="font-mono text-xs tracking-widest text-orange-900/60">SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-0.5 h-8 bg-gradient-to-b from-orange-900 to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}
