import React from 'react';

const Background = ({ children }) => {
  return (
    <div className="relative size-full bg-black"> {/* Black background */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 0.75px, #000000 0.75px)', // Radial gradient
          backgroundSize: '15px 15px', // Background size
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)', // Fade effect
          WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)', // For Safari
        }}
      />
      {children}
    </div>
  );
};

export default Background;