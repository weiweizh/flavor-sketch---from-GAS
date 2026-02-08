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
  const baseStyles = "font-hand text-xl px-8 py-3 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative group";
  
  const variants = {
    // Primary: Reversed (White BG, Black Text) + Prominent Border + Hard Shadow
    primary: "bg-warm-white text-ink-black border-2 border-ink-black shadow-[4px_4px_0px_0px_#1a1a1a] hover:shadow-[6px_6px_0px_0px_#1a1a1a] hover:-translate-y-1",
    // Secondary: Transparent, Black Text, Border
    secondary: "bg-transparent text-ink-black border-2 border-ink-black hover:bg-black/5",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
      style={{
        // Rough border radius using varied values to keep the hand-drawn feel
        borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
      }}
    >
      {isLoading ? 'Sketching...' : children}
    </button>
  );
};