import React, { useEffect, useState } from 'react';

const Parachutes = ({ setFuel }) => {
  const [position, setPosition] = useState({ x: Math.random() * 900, y: -50 });

  useEffect(() => {
    const dropParachute = setInterval(() => {
      setPosition((prev) => ({ ...prev, y: prev.y + 5 }));
      if (position.y > 768) {
        setPosition({ x: Math.random() * 900, y: -50 });
      }
    }, 100);

    return () => clearInterval(dropParachute);
  }, [position]);

  return (
    <div
      className="parachute"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '30px',
        height: '30px',
        // backgroundImage: 'url(/path/to/parachute-image.png)', // Update with your parachute image path
        backgroundSize: 'contain',
      }}
    >
      <img src='./assets/parachute.png' alt='para'></img>
    </div>
  );
};

export default Parachutes;
