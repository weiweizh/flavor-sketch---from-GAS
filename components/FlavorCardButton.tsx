import React from 'react';

export interface FlavorCardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'default' | 'small' | 'icon';
  isLoading?: boolean;
}

export const FlavorCardButton: React.FC<FlavorCardButtonProps> = ({ 
  children, 
  size = 'default',
  isLoading, 
  className = '',
  style = {},
  disabled,
  ...props 
}) => {
  const baseStyles = "relative group font-hand transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-bold select-none inline-flex items-center justify-center bg-[#fffefc] text-gray-800 border-[1.5px] border-gray-700 shadow-[2px_2px_0px_rgba(0,0,0,0.18)] hover:bg-white hover:-translate-y-0.5 rotate-[0.5deg]";
  
  const sizes = {
    default: "text-base sm:text-lg px-6 py-2.5",
    small: "text-xs sm:text-sm px-3.5 py-1.5",
    icon: "w-10 h-10 p-0 text-2xl flex items-center justify-center",
  };
  
  const mainBorderRadius = '255px 15px 225px 15px / 15px 225px 15px 255px';

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${className}`}
      style={{
        borderRadius: mainBorderRadius,
        ...style
      }}
      disabled={isLoading || disabled}
      {...props}
    >
      {/* Authentic Hand-Drawn Overlapping Pen Line Overlay */}
      <span 
        className="absolute -inset-[0.5px] border border-gray-500/50 pointer-events-none transition-all group-hover:border-gray-700 group-hover:translate-x-[0.5px]"
        style={{
          borderRadius: '15px 225px 15px 255px / 255px 15px 225px 15px',
          transform: 'rotate(-1.3deg) scale(1.01)'
        }}
      />

      <span className="relative z-10 flex items-center justify-center gap-1.5">
        {isLoading ? (
          <>
            <svg className="w-4 h-4 animate-spin text-gray-700" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Sketching...</span>
          </>
        ) : children}
      </span>
    </button>
  );
};
