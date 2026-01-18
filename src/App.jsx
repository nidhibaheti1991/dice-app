import { useState, useRef, useCallback, useEffect } from 'react';
import Dice from './components/Dice';
import Coin from './components/Coin';
import { useSound } from './hooks/useSound';
import './App.css';

function App() {
  const [mode, setMode] = useState('dice'); // 'dice' or 'coin'
  const [diceValue, setDiceValue] = useState(1);
  const [coinValue, setCoinValue] = useState('heads');
  const [isRolling, setIsRolling] = useState(false);
  const [isThrowing, setIsThrowing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false); // Sound off by default (browser autoplay policy)
  const diceRef = useRef(null);
  const coinRef = useRef(null);
  const videoRef = useRef(null);

  const { playDiceRoll, playCoinFlip } = useSound(soundEnabled);

  // Ensure video plays on mount (muted autoplay is allowed)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, video will remain paused
      });
    }
  }, []);

  // Sync video muted state with sound setting
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !soundEnabled;
      // Ensure video is playing (may have been paused by browser)
      if (soundEnabled) {
        videoRef.current.play().catch(() => {
          // Autoplay was prevented, keep video muted
          videoRef.current.muted = true;
        });
      }
    }
  }, [soundEnabled]);

  const rollDice = useCallback(() => {
    if (isRolling || isThrowing) return;

    // Play sound if enabled
    playDiceRoll();

    // Generate random result FIRST so animation can target it
    const result = Math.floor(Math.random() * 6) + 1;
    setDiceValue(result);

    // Start throwing and rolling simultaneously
    setIsThrowing(true);
    setIsRolling(true);

    // Wait for animation to complete
    setTimeout(() => {
      setIsRolling(false);
      setIsThrowing(false);
    }, 2000);
  }, [isRolling, isThrowing, playDiceRoll]);

  const flipCoin = useCallback(() => {
    if (isRolling || isThrowing) return;

    // Play sound if enabled
    playCoinFlip();

    // Generate random result FIRST so animation can target it
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    setCoinValue(result);

    // Start throwing and flipping simultaneously
    setIsThrowing(true);
    setIsRolling(true);

    // Wait for animation to complete
    setTimeout(() => {
      setIsRolling(false);
      setIsThrowing(false);
    }, 1800);
  }, [isRolling, isThrowing, playCoinFlip]);

  const handleAction = useCallback(() => {
    if (mode === 'dice') {
      rollDice();
    } else {
      flipCoin();
    }
  }, [mode, rollDice, flipCoin]);

  const switchMode = useCallback((newMode) => {
    if (!isRolling && !isThrowing) {
      setMode(newMode);
    }
  }, [isRolling, isThrowing]);

  const getButtonText = () => {
    if (isRolling) {
      return mode === 'dice' ? 'Rolling...' : 'Flipping...';
    }
    return mode === 'dice' ? 'Roll the Dice' : 'Toss the Coin';
  };

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  return (
    <div className="app">
      {/* Skip link for keyboard navigation */}
      <a href="#main-action" className="skip-link">
        Skip to main action
      </a>

      {/* Video Background - decorative, hidden from screen readers */}
      <video
        ref={videoRef}
        className="video-background"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay" aria-hidden="true" />

      {/* Sound Toggle */}
      <button
        className={`sound-toggle ${soundEnabled ? 'active' : ''}`}
        onClick={toggleSound}
        aria-label={soundEnabled ? 'Mute all sounds' : 'Unmute all sounds'}
        title={soundEnabled ? 'Sound On' : 'Sound Off'}
      >
        {soundEnabled ? (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        )}
      </button>

      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={`mode-button ${mode === 'dice' ? 'active' : ''}`}
          onClick={() => switchMode('dice')}
          disabled={isRolling || isThrowing}
        >
          Dice
        </button>
        <button
          className={`mode-button ${mode === 'coin' ? 'active' : ''}`}
          onClick={() => switchMode('coin')}
          disabled={isRolling || isThrowing}
        >
          Coin
        </button>
      </div>

      {/* Dice or Coin on the table */}
      <div className="dice-area">
        {mode === 'dice' ? (
          <Dice
            ref={diceRef}
            value={diceValue}
            isRolling={isRolling}
            isThrowing={isThrowing}
          />
        ) : (
          <Coin
            ref={coinRef}
            value={coinValue}
            isFlipping={isRolling}
            isThrowing={isThrowing}
          />
        )}
      </div>

      {/* Button at bottom */}
      <main className="content">
        <button
          id="main-action"
          className="roll-button"
          onClick={handleAction}
          disabled={isRolling || isThrowing}
        >
          {getButtonText()}
        </button>
      </main>

      {/* Screen reader announcement for results */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {!isRolling && !isThrowing && mode === 'dice' && `You rolled a ${diceValue}`}
        {!isRolling && !isThrowing && mode === 'coin' && `The coin landed on ${coinValue}`}
      </div>
    </div>
  );
}

export default App;
