import React from 'react';

export const BackgroundDoodles: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Hand-drawn grid background */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15'%3E%3Cpath d='M0 14 C 5 15, 10 13, 15 14 M14 0 C 15 5, 13 10, 14 15' stroke='%23e8e8e8' stroke-width='1' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundSize: '15px 15px'
        }}
      />
      
      {/* Plus signs background layer for fun */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cg stroke='%239ca3af' stroke-width='1' fill='none'%3E%3Cpath d='M40 44 L48 44 M44 40 L44 48' /%3E%3Cpath d='M130 194 L138 194 M134 190 L134 198' /%3E%3Cpath d='M265 89 L273 89 M269 85 L269 93' /%3E%3Cpath d='M85 269 L93 269 M89 265 L89 273' /%3E%3Cpath d='M220 224 L228 224 M224 220 L224 228' /%3E%3Cpath d='M160 89 L168 89 M164 85 L164 93' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px'
        }}
      />
      
      {/* Ballpoint pen doodles */}
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="pen-ink">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g stroke="#4b5563" fill="none" strokeWidth="1" filter="url(#pen-ink)" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
          {/* Top right scribble */}
          <path d="M 85% 10% Q 86% 8%, 84% 7% T 85% 5% T 88% 6% T 86% 8% T 89% 9% T 86% 11%" />
          <path d="M 87% 5% Q 89% 10%, 85% 11%" />
          
          {/* Bottom left spring */}
          <path d="M 10% 80% C 12% 78%, 15% 82%, 13% 85% C 10% 87%, 8% 83%, 11% 80% C 14% 77%, 18% 81%, 15% 86%" />
          
          {/* Middle left coffee bean doodle */}
          <svg x="12%" y="50%" overflow="visible">
            <g transform="rotate(-15) scale(0.6)">
              <ellipse cx="0" cy="0" rx="20" ry="30" />
              <path d="M -5 -30 C 10 -15, -10 15, 5 30" />
            </g>
          </svg>
          
          {/* Top left arrows */}
          <path d="M 5% 15% L 8% 18% L 5% 21%" />
          <path d="M 3% 18% L 8% 18%" />

          {/* Bottom right scribbles */}
          <path d="M 90% 85% C 85% 88%, 95% 92%, 88% 95% C 82% 90%, 92% 82%, 90% 85%" />

          {/* Random stars */}
          <svg x="18%" y="25%" overflow="visible">
            <g transform="rotate(10) scale(0.5)">
              <path d="M 0 -20 L 5 -5 L 20 -5 L 8 5 L 12 20 L 0 10 L -12 20 L -8 5 L -20 -5 L -5 -5 Z" />
            </g>
          </svg>
          
          <svg x="85%" y="45%" overflow="visible">
            <g transform="rotate(-20) scale(0.4)">
              <path d="M 0 -20 L 5 -5 L 20 -5 L 8 5 L 12 20 L 0 10 L -12 20 L -8 5 L -20 -5 L -5 -5 Z" />
            </g>
          </svg>

          {/* Coffee cup doodle near center right */}
          <svg x="82%" y="55%" overflow="visible">
            <g transform="scale(0.7) rotate(10)">
              <path d="M -20 -15 L -15 20 C -15 30, 15 30, 15 20 L 20 -15 Z" />
              <path d="M 20 -5 C 30 -5, 30 10, 18 10" />
              <path d="M -5 -25 Q -10 -35, -5 -45 M 5 -25 Q 0 -35, 5 -45" strokeDasharray="3 3" />
            </g>
          </svg>

          {/* Second Coffee cup */}
          <svg x="8%" y="38%" overflow="visible">
            <g transform="scale(0.8) rotate(-10)">
              <path d="M -15 -10 L -10 15 C -10 25, 10 25, 10 15 L 15 -10 Z" />
              <path d="M -15 -10 C -15 -15, 15 -15, 15 -10" />
              <path d="M -15 -10 C -15 -5, 15 -5, 15 -10" />
              <path d="M -5 -25 Q -10 -35, -5 -40" strokeDasharray="2 2" />
              <path d="M 5 -25 Q 10 -35, 5 -40" strokeDasharray="2 2" />
            </g>
          </svg>

          {/* Strawberry */}
          <svg x="14%" y="28%" overflow="visible">
            <g transform="scale(0.6) rotate(15)">
              <path d="M 0 -20 C 15 -20, 25 0, 0 30 C -25 0, -15 -20, 0 -20 Z" />
              <path d="M -10 -20 Q 0 -30, 0 -20 Q 10 -30, 10 -20 Q 0 -10, -10 -20" />
              <circle cx="-5" cy="-5" r="0.5" fill="#4b5563" />
              <circle cx="5" cy="-5" r="0.5" fill="#4b5563" />
              <circle cx="0" cy="5" r="0.5" fill="#4b5563" />
              <circle cx="-7" cy="5" r="0.5" fill="#4b5563" />
              <circle cx="7" cy="5" r="0.5" fill="#4b5563" />
              <circle cx="0" cy="15" r="0.5" fill="#4b5563" />
            </g>
          </svg>

          {/* Lemon */}
          <svg x="78%" y="85%" overflow="visible">
            <g transform="scale(0.6) rotate(-25)">
              <ellipse cx="0" cy="0" rx="25" ry="18" />
              <path d="M -25 0 C -30 -5, -35 5, -25 0" />
              <path d="M 25 0 C 30 -5, 35 5, 25 0" />
              <circle cx="-10" cy="-5" r="0.5" fill="#4b5563" />
              <circle cx="5" cy="8" r="0.5" fill="#4b5563" />
              <circle cx="10" cy="-2" r="0.5" fill="#4b5563" />
            </g>
          </svg>

          {/* A tiny smiley face */}
          <svg x="15%" y="72%" overflow="visible">
            <g transform="scale(0.8)">
              <circle cx="0" cy="0" r="15" />
              <circle cx="-5" cy="-3" r="1" fill="#4b5563" />
              <circle cx="5" cy="-3" r="1" fill="#4b5563" />
              <path d="M -6 5 Q 0 10, 6 5" />
            </g>
          </svg>

          {/* Relaxing man doodle */}
          <svg x="80%" y="25%" overflow="visible">
            <g transform="scale(0.5) rotate(15)">
              <path d="M 0 -30 C -5 -30, -5 -40, 0 -40 C 5 -40, 5 -30, 0 -30 Z" fill="#4b5563" /> {/* head */}
              <path d="M -15 -35 L 15 -35 M -10 -45 L 10 -45" /> {/* hat */}
              <path d="M -10 -15 C -20 -15, -20 -5, -10 -5" /> {/* arm */}
              <path d="M 10 -15 C 20 -15, 20 -5, 10 -5" /> {/* arm */}
              <path d="M -10 -5 C -15 10, -30 20, -30 20" /> {/* leg */}
              <path d="M 10 -5 C 5 10, -10 20, -10 20" /> {/* leg */}
              <path d="M -10 -25 L 10 -25 C 20 -25, 20 0, 10 0 L -10 0 C -20 0, -20 -25, -10 -25 Z" /> {/* body */}
              <circle cx="-2" cy="-33" r="0.5" fill="#4b5563" />
              <circle cx="2" cy="-33" r="0.5" fill="#4b5563" />
              <path d="M -2 -31 Q 0 -29, 2 -31" />
            </g>
          </svg>

          {/* Dandelion 1 */}
          <svg x="8%" y="60%" overflow="visible">
            <g transform="scale(0.6)">
              <path d="M 0 0 Q -5 20, -2 40" />
              <path d="M 0 0 L -10 -10 M 0 0 L 0 -15 M 0 0 L 10 -10 M 0 0 L -10 0 M 0 0 L 10 0 M 0 0 L -5 10 M 0 0 L 5 10" />
              <path d="M -10 -10 M 0 -15 M 10 -10 M -10 0 M 10 0 M -5 10 M 5 10" strokeDasharray="1 3" />
            </g>
          </svg>

          {/* Dandelion 2 */}
          <svg x="22%" y="55%" overflow="visible">
            <g transform="scale(0.4) rotate(15)">
              <path d="M 0 0 Q 5 25, 0 50" />
              <path d="M 0 0 L -10 -10 M 0 0 L 0 -15 M 0 0 L 10 -10 M 0 0 L -10 0 M 0 0 L 10 0 M 0 0 L -5 10 M 0 0 L 5 10" />
            </g>
          </svg>

          {/* Butterfly */}
          <svg x="90%" y="35%" overflow="visible">
            <g transform="scale(0.5) rotate(-15)">
              <ellipse cx="0" cy="0" rx="3" ry="12" fill="#4b5563" />
              <path d="M -3 -5 C -20 -15, -15 10, -3 5" />
              <path d="M 3 -5 C 20 -15, 15 10, 3 5" />
              <path d="M -3 2 C -15 5, -10 20, -1 10" />
              <path d="M 3 2 C 15 5, 10 20, 1 10" />
              <path d="M -1 -12 L -5 -20 M 1 -12 L 5 -20" />
              <circle cx="-1" cy="-8" r="0.5" fill="#fff" />
              <circle cx="1" cy="-8" r="0.5" fill="#fff" />
            </g>
          </svg>

          {/* Tulip flower */}
          <svg x="88%" y="70%" overflow="visible">
            <g transform="scale(0.7)">
              <path d="M 0 0 L 0 30" />
              <path d="M 0 15 C -10 15, -15 5, -15 5 C -10 10, 0 15, 0 15" />
              <path d="M 0 20 C 10 20, 15 10, 15 10 C 10 15, 0 20, 0 20" />
              <path d="M -10 -20 C -15 -5, -5 0, 0 0 C 5 0, 15 -5, 10 -20 C 5 -10, 2 -5, 0 -10 C -2 -5, -5 -10, -10 -20 Z" fill="#4b5563" />
            </g>
          </svg>

          {/* Cute Cloud */}
          <svg x="12%" y="10%" overflow="visible">
            <g transform="scale(0.6)">
              <path d="M -15 0 C -15 -10, -5 -15, 0 -10 C 5 -20, 20 -15, 20 -5 C 30 -5, 30 10, 20 10 L -10 10 C -20 10, -20 0, -15 0 Z" />
            </g>
          </svg>
          <svg x="75%" y="12%" overflow="visible">
            <g transform="scale(0.4)">
              <path d="M -15 0 C -15 -10, -5 -15, 0 -10 C 5 -20, 20 -15, 20 -5 C 30 -5, 30 10, 20 10 L -10 10 C -20 10, -20 0, -15 0 Z" />
            </g>
          </svg>

        </g>
      </svg>
    </div>
  );
};
