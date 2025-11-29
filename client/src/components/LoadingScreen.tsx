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

  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Circular Progress with Logo */}
        <div className="relative w-48 h-48">
          {/* Background Circle */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 150 150"
          >
            <circle
              cx="75"
              cy="75"
              r="60"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              opacity="0.1"
            />
            {/* Progress Ring */}
            <motion.circle
              cx="75"
              cy="75"
              r="60"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '75px 75px',
              }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.3 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF0000" />
                <stop offset="100%" stopColor="#FF0000" />
              </linearGradient>
            </defs>
          </svg>

          {/* Logo Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-20 h-auto object-contain" />
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="text-center">
          <span className="font-mono text-sm text-white/60">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
