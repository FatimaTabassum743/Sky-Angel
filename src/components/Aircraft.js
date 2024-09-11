import React, { useEffect, useState } from 'react';

const Aircraft = () => {
  const [position, setPosition] = useState({ x: 512, y: 384 }); // Center of the screen

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" && position.x > 0) {
      setPosition((prev) => ({ ...prev, x: prev.x - 10 }));
    } else if (e.key === "ArrowRight" && position.x < 1024 - 50) { // Assume aircraft width is 50px
      setPosition((prev) => ({ ...prev, x: prev.x + 10 }));
    } else if (e.key === "ArrowUp" && position.y > 0) {
      setPosition((prev) => ({ ...prev, y: prev.y - 10 }));
    } else if (e.key === "ArrowDown" && position.y < 768 - 50) { // Assume aircraft height is 50px
      setPosition((prev) => ({ ...prev, y: prev.y + 10 }));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [position]);

  return (
    <div
      className="aircraft"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '50px',
        height: '50px',
        // backgroundImage: 'url(./assets/)', // Update with your aircraft image path
        backgroundSize: 'contain',
      }}
    >
      <img src='./assets/aircraft.png' height={100} width={100} alt='aircraft'></img>
    </div>
  );
};

export default Aircraft;
