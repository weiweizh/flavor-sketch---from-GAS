import React from 'react';

interface HandDrawnButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const HandDrawnButton: React.FC<HandDrawnButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '',
  ...props 
}) => {
  const baseStyles = "font-hand text-xl px-6 py-3 transition-transform duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative group";
  
  const variants = {
    primary: "bg-ink-black text-warm-white",
    secondary: "bg-transparent text-ink-black border-2 border-ink-black",
  };

  // SVG path for a rough border effect
  const BorderSVG = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
      <rect 
        x="0" 
        y="0" 
        width="100%" 
        height="100%" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className="text-ink-black"
        rx="2"
        style={{ filter: 'url(#rough-edge)' }}
      />
       {/* Simple SVG filter for waviness */}
      <defs>
        <filter id="rough-edge">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </defs>
    </svg>
  );

  return (
    <button 
      className={`${baseStyles} ${variant === 'primary' ? 'hover:-translate-y-1 hover:shadow-lg' : ''} ${className}`}
      disabled={isLoading}
      {...props}
      style={{
        // Rough border radius using varied values
        borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
        border: variant === 'secondary' ? '2px solid #1a1a1a' : 'none'
      }}
    >
      {isLoading ? 'Sketching...' : children}
      {/* Decorative underline for primary */}
      {variant === 'primary' && (
         <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-black opacity-20 rounded-full blur-[1px]"></div>
      )}
    </button>
  );
};