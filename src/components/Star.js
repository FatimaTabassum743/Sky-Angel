import React, { useEffect, useState } from 'react';

const Stars = ({ screenHeight, screenWidth, speed, aircraftPosition, onCollectStar }) => {
  const [x, setX] = useState(Math.random() * screenWidth);
  const [y, setY] = useState(-50);

  useEffect(() => {
    const interval = setInterval(() => {
      setY((prevY) => (prevY >= screenHeight ? -50 : prevY + speed));
      if (
        x < aircraftPosition.x + 50 && // Aircraft width
        x + 20 > aircraftPosition.x && // Star width
        y < aircraftPosition.y + 50 && // Aircraft height
        y + 20 > aircraftPosition.y // Star height
      ) {
        onCollectStar(); // Increase star count when collected
        setY(-50); // Reset star position
      }
    }, 50);

    return () => clearInterval(interval);
  }, [x, y, aircraftPosition, screenHeight, speed, onCollectStar]);

  return (
    <div
      style={{
        position: 'absolute',
        width: '20px',
        height: '20px',
        backgroundImage: "url('./assets/star.png')",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        left: `${x}px`,
        top: `${y}px`,
      }}
    ></div>
  );
};

export default Stars;
