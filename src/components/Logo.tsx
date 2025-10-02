import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-green-600"
          fill="currentColor"
        >
          {/* House outline */}
          <path
            d="M20 70 L20 45 L50 20 L80 45 L80 70 Z"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Tree on the left */}
          <g transform="translate(30, 50)">
            {/* Tree trunk */}
            <rect x="2" y="15" width="3" height="8" fill="currentColor" />
            {/* Tree leaves */}
            <circle cx="3.5" cy="12" r="4" fill="currentColor" />
            <circle cx="1" cy="8" r="3" fill="currentColor" />
            <circle cx="6" cy="8" r="3" fill="currentColor" />
          </g>
          
          {/* Chair on the right */}
          <g transform="translate(60, 50)">
            {/* Chair back */}
            <rect x="0" y="0" width="8" height="2" fill="currentColor" />
            {/* Chair seat */}
            <rect x="1" y="2" width="6" height="2" fill="currentColor" />
            {/* Chair legs */}
            <rect x="1" y="4" width="1" height="6" fill="currentColor" />
            <rect x="6" y="4" width="1" height="6" fill="currentColor" />
            {/* Chair armrests */}
            <rect x="0" y="1" width="1" height="3" fill="currentColor" />
            <rect x="7" y="1" width="1" height="3" fill="currentColor" />
          </g>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className={`font-bold text-green-600 ${textSizeClasses[size]}`}>
          GreenNest
        </div>
      )}
    </div>
  );
}
