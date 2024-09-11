import React, { useEffect, useState } from 'react';

const Bird = ({ screenWidth, screenHeight, speed }) => {
  const [x, setX] = useState(screenWidth);
  const y = Math.random() * (screenHeight - 50); // Ensure the bird stays within screen bounds

  useEffect(() => {
    const interval = setInterval(() => {
      setX((prevX) => (prevX <= 0 ? screenWidth : prevX - speed)); // Move bird left and reset if off screen
    }, 50);

    return () => clearInterval(interval);
  }, [screenWidth, speed]);

  return (
    <div
      style={{
        position: 'absolute',
        width: '30px',
        height: '30px',
        backgroundImage: "url('./assets/bird.png')",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <img src='./assets/bird.png' alt='bird'></img>
    </div>
  );
};

export default Bird;
