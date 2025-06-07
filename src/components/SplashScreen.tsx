/**
 * Splash screen animation component that shows on app load
 * Features the BYC logo with a quick Facebook-style animation
 */

import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide splash screen after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Give time for fade out animation before calling onComplete
      setTimeout(onComplete, 300);
    }, 1800); // Total animation time

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-white z-[100] animate-fade-out pointer-events-none">
        <div className="flex items-center justify-center h-full">
          <img 
            src="/lovable-uploads/a821d037-ae31-49d1-b24f-bc9ff39128a1.png" 
            alt="Build Your City"
            className="w-20 h-20 opacity-0 transition-opacity duration-300"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center">
      <div className="text-center">
        {/* Logo with scale and fade animation */}
        <img 
          src="/lovable-uploads/a821d037-ae31-49d1-b24f-bc9ff39128a1.png" 
          alt="Build Your City"
          className="w-20 h-20 mx-auto animate-scale-in"
          style={{
            animation: 'scale-in 0.6s ease-out'
          }}
        />
        
        {/* Loading indicator */}
        <div className="mt-8 flex justify-center">
          <div 
            className="w-6 h-6 border-2 border-urgent-citrus border-t-transparent rounded-full animate-spin"
            style={{
              animationDelay: '0.3s'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;