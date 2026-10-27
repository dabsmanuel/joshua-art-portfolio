import React from 'react';

const AnimationStyles: React.FC = () => {
  return (
    <style jsx>{`
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }

      .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out forwards;
      }

      .animation-delay-200 {
        animation-delay: 0.2s;
      }

      .animation-delay-400 {
        animation-delay: 0.4s;
      }

      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
    `}</style>
  );
};

export default AnimationStyles;