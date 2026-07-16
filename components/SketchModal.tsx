import React, { useEffect } from 'react';
import { FlavorCardButton } from './FlavorCardButton';

export interface SketchModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export const SketchModal: React.FC<SketchModalProps> = ({ 
  isOpen, 
  onClose, 
  children,
  className = '',
  maxWidth = 'max-w-2xl'
}) => {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const mainBorderRadius = '255px 15px 225px 15px / 15px 225px 15px 255px';
  const overlayBorderRadius = '15px 225px 15px 255px / 255px 15px 225px 15px';

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/70 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className={`relative z-10 bg-[#fffefc] text-gray-800 border-[1.5px] border-gray-700 shadow-[8px_8px_0px_rgba(0,0,0,0.18)] p-6 md:p-8 w-full my-8 ${maxWidth} ${className}`}
        style={{ borderRadius: mainBorderRadius }}
      >
        {/* Authentic Hand-Drawn Overlapping Pen Line Overlay */}
        <div 
          className="absolute -inset-[0.5px] border border-gray-500/50 pointer-events-none"
          style={{
            borderRadius: overlayBorderRadius,
            transform: 'rotate(-0.3deg) scale(1.002)'
          }}
        />

        <FlavorCardButton 
          size="icon"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-20 sm:-top-4 sm:-right-4 !bg-white"
        >
          ×
        </FlavorCardButton>

        {/* Content Area */}
        <div className="relative z-10 max-h-[80vh] overflow-y-auto overflow-x-hidden pr-2">
          {children}
        </div>
      </div>
    </div>
  );
};
