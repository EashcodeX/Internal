import React from 'react';
import '../styles/LoadingAnimation.css';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-400/30 to-purple-400/30 animate-pulse" />
        
        {/* Main container */}
        <div className="relative flex items-center space-x-6">
          {['T', 'I', 'S'].map((letter, index) => (
            <div
              key={letter}
              className="relative"
            >
              {/* Letter */}
              <div
                className="text-6xl font-black tracking-wider"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '2px #3b82f6',
                  animation: 'letterPulse 1.5s ease-in-out infinite',
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {letter}
              </div>

              {/* Animated border */}
              <div
                className="absolute inset-0 border-2 border-transparent"
                style={{
                  animation: 'borderGlow 2s ease-in-out infinite',
                  animationDelay: `${index * 0.2}s`,
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  opacity: 0.3,
                }}
              >
                {letter}
              </div>

              {/* Moving dots */}
              <div
                className="absolute -bottom-4 left-1/2 w-1 h-1 rounded-full bg-blue-500"
                style={{
                  animation: 'dotMove 1.5s ease-in-out infinite',
                  animationDelay: `${index * 0.2}s`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Analytics decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping" />
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 