import React from 'react';

interface FloatingElementProps {
  size: 'small' | 'large';
  position: 'top-left' | 'bottom-right';
  animation: 'float' | 'bounce';
}

const FloatingElement: React.FC<FloatingElementProps> = ({ size, position, animation }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const positionClasses = {
    'top-left': 'top-1/4 left-1/4',
    'bottom-right': 'top-3/4 right-1/3'
  };

  const animationClasses = {
    float: 'animate-float',
    bounce: 'animate-bounce'
  };

  return (
    <div className={`absolute ${positionClasses[position]} ${animationClasses[animation]} opacity-20`}>
      <div className={`${sizeClasses[size]} bg-gray-400 rounded-full`}></div>
    </div>
  );
};

export default FloatingElement;