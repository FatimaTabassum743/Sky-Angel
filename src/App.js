// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';


function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [fuel, setFuel] = useState(10);
  const [aircraftPosition, setAircraftPosition] = useState({ x: 50, y: 688 });
  const [birds, setBirds] = useState([]);
  const [parachutes, setParachutes] = useState([]);
  const [stars, setStars] = useState([]);
  const [clouds, setClouds] = useState([]);
  const [starCount, setStarCount] = useState(0);
  const [userName, setUserName] = useState('');
  const [ranking, setRanking] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const timerRef = useRef(null);
  const fuelRef = useRef(null);
  const birdRef = useRef(null);
  const parachuteRef = useRef(null);
  const starRef = useRef(null);
  useEffect(() => {
    if (gameStarted && !gamePaused && !gameOver) {
      const cloudMovement = setInterval(() => {
        moveClouds();
      }, 100);
  
      const cloudSpawnInterval = setInterval(() => {
        spawnCloud();
      }, 7000); // Clouds spawn every 7 seconds
  
      return () => {
        clearInterval(cloudMovement);
        clearInterval(cloudSpawnInterval);
      };
    }
  }, [gameStarted, gamePaused, gameOver]);
  
  useEffect(() => {
    if (gameStarted && !gamePaused && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      fuelRef.current = setInterval(() => {
        setFuel((prev) => {
          if (prev <= 0) {
            clearInterval(fuelRef.current);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      birdRef.current = setInterval(() => {
        spawnBird();
      }, 3000);

      parachuteRef.current = setInterval(() => {
        spawnParachute();
      }, 5000);

      starRef.current = setInterval(() => {
        spawnStar();
      }, 7000);

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keydown', handlePauseResume);

      return () => {
        clearInterval(timerRef.current);
        clearInterval(fuelRef.current);
        clearInterval(birdRef.current);
        clearInterval(parachuteRef.current);
        clearInterval(starRef.current);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keydown', handlePauseResume);
      };
    }
  }, [gameStarted, gamePaused, gameOver]);

  useEffect(() => {
    if (gameStarted && !gamePaused && !gameOver) {
      const collisionCheck = setInterval(() => {
        setBirds((prev) => {
          return prev
            .filter((bird) => {
              if (
                aircraftPosition.x < bird.x + 50 &&
                aircraftPosition.x + 100 > bird.x &&
                aircraftPosition.y < bird.y + 50 &&
                aircraftPosition.y + 50 > bird.y
              ) {
                endGame();
                return false;
              }
              return true;
            });
        });

        setParachutes((prev) => {
          return prev
            .filter((parachute) => {
              if (
                aircraftPosition.x < parachute.x + 50 &&
                aircraftPosition.x + 100 > parachute.x &&
                aircraftPosition.y < parachute.y + 50 &&
                aircraftPosition.y + 50 > parachute.y
              ) {
                setFuel((prev) => Math.min(100, prev + 10)); // Increase fuel, max 100
                return false; // Remove parachute
              }
              return true;
            });
        });

        setStars((prev) => {
          return prev
            .filter((star) => {
              if (
                aircraftPosition.x < star.x + 30 &&
                aircraftPosition.x + 100 > star.x &&
                aircraftPosition.y < star.y + 30 &&
                aircraftPosition.y + 50 > star.y
              ) {
                setStarCount((prev) => prev + 1);
                return false; // Remove star
              }
              return true;
            });
        });
      }, 100);

      return () => {
        clearInterval(collisionCheck);
      };
    }
  }, [aircraftPosition, gameStarted, gamePaused, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGamePaused(false);
    setGameOver(false);
    setTimer(0);
    setFuel(10);
    setAircraftPosition({ x: (1024 - 100) / 2, y: (768 - 50) / 2 });
    setBirds([]);
    setParachutes([]);
    setStars([]);
    setStarCount(0);
    setUserName('');
    setSubmitDisabled(true);
    setRanking([]);
  };

  const endGame = () => {
    setGameStarted(false);
    setGameOver(true);
    clearInterval(timerRef.current);
    clearInterval(fuelRef.current);
    clearInterval(birdRef.current);
    clearInterval(parachuteRef.current);
    clearInterval(starRef.current);
  };

  const handleKeyDown = (e) => {
    if (!gameStarted || gamePaused || gameOver) return;

    const step = 10; // Movement step size
    setAircraftPosition((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      switch (e.key) {
        case 'ArrowLeft':
          newX = Math.max(0, prev.x - step);
          break;
        case 'ArrowRight':
          newX = Math.min(1024 - 100, prev.x + step); // 1024 is the screen width, 100 is aircraft width
          break;
        case 'ArrowUp':
          newY = Math.max(0, prev.y - step);
          break;
        case 'ArrowDown':
          newY = Math.min(768 - 50, prev.y + step); // 768 is the screen height, 50 is aircraft height
          break;
        default:
          break;
      }

      return { x: newX, y: newY };
    });
  };

  const handlePauseResume = (e) => {
    if (e.key === ' ' || e.type === 'click') {
      setGamePaused((prev) => !prev);
    }
  };
  const spawnCloud = () => {
    const newCloud = {
      x: 1024, // Start position from the right
      y: Math.floor(Math.random()*200),  // Random vertical position (height less than screen height)
    };
    setClouds((prev) => [...prev, newCloud]);
  };
  const moveClouds = () => {
    setClouds((prev) => {
      return prev
        .map((cloud) => ({
          ...cloud,
          x: cloud.x - 2, // Move cloud left slowly (slower than birds)
        }))
        .filter((cloud) => cloud.x > -150); // Remove off-screen clouds (assuming cloud width is 150px)
    });
  };
    
  const spawnBird = () => {
    const newBird = {
      x: 1024, // Start position from the right
      y: Math.floor(Math.random() * (768 - 50)), // Random vertical position
    };
    setBirds((prev) => [...prev, newBird]);
  };

  const moveBirds = () => {
    setBirds((prev) => {
      return prev
        .map((bird) => ({
          ...bird,
          x: bird.x - 5, // Move bird left
        }))
        .filter((bird) => bird.x > -50); // Remove off-screen birds
    });
  };

  const spawnParachute = () => {
    const newParachute = {
      x: Math.floor(Math.random() * (1024 - 50)), // Random horizontal position
      y: 0, // Start position at the top
    };
    setParachutes((prev) => [...prev, newParachute]);
  };
  
  const spawnStar = () => {
    const newStar = {
      x: Math.floor(Math.random() * (1024 - 30)), // Random horizontal position
      y: 0, // Start position at the top
    };
    setStars((prev) => [...prev, newStar]);
  };

  const moveParachutes = () => {
    setParachutes((prev) => {
      return prev
        .map((parachute) => ({
          ...parachute,
          y: parachute.y + 4, // Move parachute downward
        }))
        .filter((parachute) => parachute.y < 768); // Remove off-screen parachutes
    });
  };
  
  const moveStars = () => {
    setStars((prev) => {
      return prev
        .map((star) => ({
          ...star,
          y: star.y + 3, // Move star downward
        }))
        .filter((star) => star.y < 768); // Remove off-screen stars
    });
  };
  
  
  useEffect(() => {
    if (gameStarted && !gamePaused && !gameOver) {
      const birdMovement = setInterval(() => {
        moveBirds();
      }, 100);

      const parachuteMovement = setInterval(() => {
        moveParachutes();
      }, 100);

      const starMovement = setInterval(() => {
        moveStars();
      }, 100);

      return () => {
        clearInterval(birdMovement);
        clearInterval(parachuteMovement);
        clearInterval(starMovement);
      };
    }
  }, [gameStarted, gamePaused, gameOver]);

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    setSubmitDisabled(e.target.value.trim() === '');
  };

  const handleSubmit = async () => {
    if (!userName.trim()) {
      return; // Prevent submission if the name is empty
    }
    // console.log(response,"ressss");
      window.alert("Rank Store at backend Api not working")
    
  
    try {
      const response = await fetch('http://xxxxxxxxx/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: userName,
          time: timer,
          stars: starCount,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const text = await response.text(); // Get response as text
      try {
        const data = JSON.parse(text); // Attempt to parse JSON
        console.log(data,"data");
        const sortedRanking = data
          .sort((a, b) => {
            if (b.stars !== a.stars) {
              return b.stars - a.stars;
            }
            return a.time - b.time;
          });
  
        setRanking(sortedRanking);
      } catch (error) {
        console.error('Failed to parse JSON:', error);
      }
    } catch (error) {
      console.error('Failed to fetch ranking:', error);
    }
  };
  
  return (
    <div className="App">
      {!gameStarted && !gameOver && (
        <div className="start-screen">
          <button onClick={startGame}>Start Game</button>
        </div>
      )}
      {gameOver && !gameStarted && (
        <div className="game-over">
          <h2>Game Over</h2>
          <p>Enter your name:</p>
          <input
            type="text"
            value={userName}
            onChange={handleUserNameChange}
            placeholder="Your name"
          />
          <button
            onClick={handleSubmit}
            disabled={submitDisabled}
          >
            Submit
          </button>
          <div className="ranking">
            <h3>Ranking</h3>
            <ul>
              {ranking.map((player, index) => (
                <li key={player.id}>
                  {index + 1}. {player.name} - Time: {player.time}s, Stars: {player.stars}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={startGame}>Start New Game</button>
        </div>
      )}
      {gameStarted && !gameOver && (
        <div className="game-container">
          <div
            className="game-screen"
           
          > 
          {/* <img src={} height={100} width={100}  alt='cloud'></img> */}
            <div
              className="aircraft"
              style={{ left: aircraftPosition.x + 'px', top: aircraftPosition.y + 'px' }}
            ></div>
            {clouds.map((cloud, index) => (
  <div
    key={index}
    className="cloud"
    style={{ left: cloud.x + 'px', top: cloud.y + 'px' }}
  ></div>
))}

            {birds.map((bird, index) => (
              <div
                key={index}
                className="bird"
                style={{ left: bird.x + 'px', top: bird.y + 'px' }}
              ></div>
            ))}
            {parachutes.map((parachute, index) => (
              <div
                key={index}
                className="parachute"
                style={{ left: parachute.x + 'px', top: parachute.y + 'px' }}
              ></div>
            ))}
            {stars.map((star, index) => (
              <div
                key={index}
                className="star"
                style={{ left: star.x + 'px', top: star.y + 'px' }}
              ></div>
            ))}
            <div className="timer">Time: {timer}s</div>
            <div className="fuel">Fuel: {fuel}</div>
            <div className="stars-counter">Stars: {starCount > 0 ? starCount - 1 : 0}</div>

            <button className="pause-button" onClick={handlePauseResume}>
              {gamePaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
