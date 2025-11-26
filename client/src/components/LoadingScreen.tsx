import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logo from '@assets/logo.webp';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading with exponential curve towards 100%
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        
        // Exponential slowdown as we approach 100%
        const increment = Math.random() * Math.pow(1 - prev / 100, 2) * 20;
        return Math.min(prev + increment, 95);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Complete loading after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: progress === 100 ? 0 : 1 }}
      transition={{ duration: 0.6, delay: progress === 100 ? 0 : 0 }}
      onAnimationComplete={() => {
        if (progress === 100) {
          // Component will be removed by parent
        }
      }}
      className="fixed inset-0 bg-background z-[9999] flex items-center justify-center pointer-events-none"
    >
      <div className="w-64">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="h-12 w-auto object-contain mx-auto mb-6" />
          <h1 className="font-display text-3xl text-white uppercase tracking-tighter">
            Загрузка...
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden border border-white/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          
          {/* Progress Text */}
          <div className="text-center mt-6">
            <span className="font-mono text-sm text-white/60">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Dots Animation */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
              }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
