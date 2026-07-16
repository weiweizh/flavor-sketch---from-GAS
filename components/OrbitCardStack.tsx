import React, { useState } from 'react';

interface OrbitCardStackProps {
  children: React.ReactNode[];
  spread?: number;
  lift?: number;
  onActiveChange?: (index: number | null) => void;
}

export function OrbitCardStack({
  children,
  spread = 200, 
  lift = 60,
  onActiveChange
}: OrbitCardStackProps) {
  const [isStackHovered, setIsStackHovered] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleActiveChange = (index: number | null) => {
    setActiveCard(index);
    if (onActiveChange) {
      onActiveChange(index);
    }
  };

  const numCards = React.Children.count(children);

  return (
    <div 
      className="relative flex justify-center w-full max-w-full my-12"
      onMouseEnter={() => setIsStackHovered(true)}
      onMouseLeave={() => {
        setIsStackHovered(false);
        handleActiveChange(null);
      }}
    >
      {React.Children.map(children, (child, index) => {
        const isHovered = isStackHovered && numCards > 1;
        const centerIndex = (numCards - 1) / 2;
        const offsetFromCenter = index - centerIndex;
        
        // Fanned state (Hovered) - forms an arc
        const fannedX = offsetFromCenter * spread;
        const fannedY = Math.abs(offsetFromCenter) * 30; // Move down to form an arc
        const fannedRot = offsetFromCenter * 10; // Rotate to fan out
        
        // Collapsed state (Stacked) - peeks from edges
        const collapsedX = offsetFromCenter * 12; // Peek from sides
        const collapsedY = Math.abs(offsetFromCenter) * -8; // Peek from top
        const collapsedRot = offsetFromCenter * 4; // Slight rotation

        const xOffset = isHovered ? fannedX : collapsedX;
        const baseYOffset = isHovered ? fannedY : collapsedY;
        
        const isCardActive = activeCard === index && numCards > 1;
        const yOffset = baseYOffset + (isCardActive ? -lift : 0);
        const rotation = isHovered ? fannedRot : collapsedRot;

        const distance = Math.abs(offsetFromCenter);
        // Ensure center card is always on top. For ties (even number of cards), bias towards the right.
        const baseZIndex = 100 - distance * 10 + (index > centerIndex ? 1 : 0);
        const zIndex = isCardActive ? 200 : baseZIndex;

        return (
          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              index === 0 ? 'relative' : 'absolute top-0'
            }`}
            style={{
              transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`,
              zIndex,
              transformOrigin: 'center bottom',
            }}
            onMouseEnter={() => numCards > 1 && handleActiveChange(index)}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
