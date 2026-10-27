import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SocialButtonProps {
  icon: LucideIcon;
  label: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon: Icon, label }) => {
  return (
    <button
      className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transform hover:-translate-y-1 transition-all duration-300"
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

export default SocialButton;