// src/components/GameOver.js
import React, { useState } from 'react';

const GameOver = ({ onRestart, time, stars }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Call the handleSubmitScore function
    try {
      await handleSubmitScore(playerName); // Pass the player's name
      onRestart(); // Restart the game after the score is submitted
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  // AJAX function to submit score and fetch ranking
  const handleSubmitScore = async (name) => {
    try {
      const response = await fetch('http://xxxxxxxxx/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player: name,
          time,
          stars,
        }),
      });
      const ranking = await response.json();
      console.log('Ranking:', ranking); // You can display ranking here or pass it back to the parent component
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  return (
    <div>
      <h1>Game Over</h1>
      <p>Time: {time} seconds</p>
      <p>Stars Collected: {stars}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default GameOver;
