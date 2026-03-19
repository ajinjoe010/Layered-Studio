import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

interface MannequinProps {
  topColor?: string;
  bottomColor?: string;
  shoesColor?: string;
  bodyType?: string;
  className?: string;
  isLoading?: boolean;
}

export const Mannequin: React.FC<MannequinProps> = ({
  topColor = '#E5E7EB',
  bottomColor = '#D1D5DB',
  shoesColor = '#9CA3AF',
  bodyType = 'Average',
  className,
  isLoading = false
}) => {
  // Adjust proportions based on body type
  const getProportions = () => {
    const type = bodyType.toLowerCase();
    if (type.includes('inverted triangle') || type.includes('broad shoulders')) {
      return { shoulderWidth: 1.2, waistWidth: 0.8, legWidth: 0.9 };
    }
    if (type.includes('rectangle') || type.includes('athletic')) {
      return { shoulderWidth: 1.1, waistWidth: 0.9, legWidth: 1.0 };
    }
    if (type.includes('oval') || type.includes('endomorph')) {
      return { shoulderWidth: 1.0, waistWidth: 1.2, legWidth: 1.1 };
    }
    if (type.includes('triangle') || type.includes('pear')) {
      return { shoulderWidth: 0.8, waistWidth: 1.1, legWidth: 1.2 };
    }
    if (type.includes('ectomorph') || type.includes('slim')) {
      return { shoulderWidth: 0.9, waistWidth: 0.8, legWidth: 0.8 };
    }
    return { shoulderWidth: 1, waistWidth: 1, legWidth: 1 };
  };

  const p = getProportions();

  return (
    <div className={cn("relative flex items-center justify-center bg-grey-dark/5 rounded-[3rem] overflow-hidden p-8 perspective-[1000px]", className)}>
      {/* 3D Background Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.8),transparent)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full"
          />
        </div>
      )}

      <motion.div
        initial={{ rotateY: -20, rotateX: 5 }}
        animate={{ rotateY: 10, rotateX: 0 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 200 400"
          className="w-full h-full max-h-[400px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E5E7EB" />
            </linearGradient>
            <linearGradient id="topGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
            </linearGradient>
            <linearGradient id="bottomGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.2)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
            </linearGradient>
            <filter id="fabricTexture" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
              <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="1" result="diffuse">
                <feDistantLight azimuth="45" elevation="45" />
              </feDiffuseLighting>
              <feComposite operator="in" in="diffuse" in2="SourceGraphic" />
            </filter>
            <filter id="innerShadow">
              <feOffset dx="0" dy="2" />
              <feGaussianBlur stdDeviation="3" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="black" floodOpacity="0.2" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>

          {/* Head */}
          <motion.circle
            cx="100" cy="40" r="25"
            fill="url(#headGrad)"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          />

          {/* Neck */}
          <rect x="92" y="60" width="16" height="15" fill="#D1D5DB" />

          {/* Torso / Top */}
          <g filter="url(#fabricTexture)">
            <g filter="url(#innerShadow)">
              <motion.path
                d={`
                  M ${100 - 50 * p.shoulderWidth} 75
                  Q 100 70 ${100 + 50 * p.shoulderWidth} 75
                  L ${100 + 45 * p.waistWidth} 180
                  Q 100 190 ${100 - 45 * p.waistWidth} 180
                  Z
                `}
                fill={topColor}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              />
              {/* Collar Detail */}
              <path
                d={`M 85 75 Q 100 95 115 75`}
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="2"
                fill="none"
              />
              {/* Buttons Detail */}
              <circle cx="100" cy="110" r="2" fill="rgba(0,0,0,0.2)" />
              <circle cx="100" cy="130" r="2" fill="rgba(0,0,0,0.2)" />
              <circle cx="100" cy="150" r="2" fill="rgba(0,0,0,0.2)" />
              
              <path
                d={`
                  M ${100 - 50 * p.shoulderWidth} 75
                  Q 100 70 ${100 + 50 * p.shoulderWidth} 75
                  L ${100 + 45 * p.waistWidth} 180
                  Q 100 190 ${100 - 45 * p.waistWidth} 180
                  Z
                `}
                fill="url(#topGrad)"
              />
            </g>
          </g>

          {/* Arms */}
          <g filter="url(#fabricTexture)">
            <motion.path
              d={`M ${100 - 50 * p.shoulderWidth} 75 Q ${100 - 60 * p.shoulderWidth} 120 ${100 - 70 * p.shoulderWidth} 160`}
              stroke={topColor}
              strokeWidth="22"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            {/* Cuff Detail */}
            <path d={`M ${100 - 70 * p.shoulderWidth - 6} 155 L ${100 - 70 * p.shoulderWidth + 6} 165`} stroke="rgba(0,0,0,0.1)" strokeWidth="3" />
            
            <motion.path
              d={`M ${100 + 50 * p.shoulderWidth} 75 Q ${100 + 60 * p.shoulderWidth} 120 ${100 + 70 * p.shoulderWidth} 160`}
              stroke={topColor}
              strokeWidth="22"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            {/* Cuff Detail */}
            <path d={`M ${100 + 70 * p.shoulderWidth - 6} 155 L ${100 + 70 * p.shoulderWidth + 6} 165`} stroke="rgba(0,0,0,0.1)" strokeWidth="3" />
          </g>

          {/* Legs / Bottom */}
          <g filter="url(#fabricTexture)">
            <g filter="url(#innerShadow)">
              <motion.path
                d={`
                  M ${100 - 45 * p.waistWidth} 180
                  L ${100 + 45 * p.waistWidth} 180
                  L ${100 + 50 * p.legWidth} 350
                  Q ${100 + 25 * p.legWidth} 355 ${100 + 10 * p.legWidth} 350
                  L 100 200
                  L ${100 - 10 * p.legWidth} 350
                  Q ${100 - 25 * p.legWidth} 355 ${100 - 50 * p.legWidth} 350
                  Z
                `}
                fill={bottomColor}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
              {/* Pocket Details */}
              <path d={`M ${100 - 35 * p.waistWidth} 195 Q ${100 - 20 * p.waistWidth} 205 ${100 - 10 * p.waistWidth} 200`} stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" fill="none" />
              <path d={`M ${100 + 35 * p.waistWidth} 195 Q ${100 + 20 * p.waistWidth} 205 ${100 + 10 * p.waistWidth} 200`} stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" fill="none" />
              
              <path
                d={`
                  M ${100 - 45 * p.waistWidth} 180
                  L ${100 + 45 * p.waistWidth} 180
                  L ${100 + 50 * p.legWidth} 350
                  Q ${100 + 25 * p.legWidth} 355 ${100 + 10 * p.legWidth} 350
                  L 100 200
                  L ${100 - 10 * p.legWidth} 350
                  Q ${100 - 25 * p.legWidth} 355 ${100 - 50 * p.legWidth} 350
                  Z
                `}
                fill="url(#bottomGrad)"
              />
            </g>
          </g>

          {/* Shoes */}
          <motion.path
            d={`M ${100 - 45 * p.legWidth} 350 L ${100 - 65 * p.legWidth} 375 L ${100 - 15 * p.legWidth} 375 L ${100 - 5 * p.legWidth} 350 Z`}
            fill={shoesColor}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          />
          <motion.path
            d={`M ${100 + 45 * p.legWidth} 350 L ${100 + 65 * p.legWidth} 375 L ${100 + 15 * p.legWidth} 375 L ${100 + 5 * p.legWidth} 350 Z`}
            fill={shoesColor}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          />
        </svg>
      </motion.div>

      {/* Ground Shadow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-6 bg-black/10 rounded-[100%] blur-xl" />
    </div>
  );
};
