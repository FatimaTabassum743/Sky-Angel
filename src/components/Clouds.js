import React, { useEffect, useState } from 'react';

const Clouds = () => {
  const [cloudPosition, setCloudPosition] = useState(1024); // Start from the right side

  useEffect(() => {
    const moveClouds = setInterval(() => {
      setCloudPosition((prev) => (prev <= -200 ? 1024 : prev - 5)); // Move left, reset when off-screen
    }, 50);

    return () => clearInterval(moveClouds);
  }, []);

  return (
    <div
      className="clouds"
      style={{
        position: 'absolute',
        left: `${cloudPosition}px`,
        top: '100px', // Adjust this for cloud positioning
        width: '200px',
        height: '100px',
        backgroundImage: 'url(/path/to/cloud-image.png)', // Update with your cloud image path
        backgroundSize: 'contain',
      }}
    >
        <img src='./assets/bird.png' alt='cloud'></img>
    </div>
  );
};

export default Clouds;
