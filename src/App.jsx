import { useState, useRef, useCallback, useEffect } from 'react';
import Dice from './components/Dice';
import Coin from './components/Coin';
import ThemeToggle from './components/ThemeToggle';
import PremiumModal from './components/PremiumModal';
import { usePremium } from './contexts/PremiumContext';
import { useSound } from './hooks/useSound';
import './App.css';

function App() {
  const [mode, setMode] = useState('dice'); // 'dice' or 'coin'
  const [diceValue, setDiceValue] = useState(1);
  const [coinValue, setCoinValue] = useState('heads');
  const [isRolling, setIsRolling] = useState(false);
  const [isThrowing, setIsThrowing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const diceRef = useRef(null);
  const coinRef = useRef(null);
  const videoRef = useRef(null);

  const {
    hasPurchased,
    soundEnabled,
    toggleSound: togglePremiumSound,
    ambientEnabled,
    toggleAmbient,
  } = usePremium();
  const { playDiceRoll, playCoinFlip } = useSound();

  // Detect system preference on mount
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Sync video muted state with ambient sound setting
  useEffect(() => {
    if (videoRef.current) {
      const shouldPlay = ambientEnabled && hasPurchased('ambientSound');
      videoRef.current.muted = !shouldPlay;
    }
  }, [ambientEnabled, hasPurchased]);

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

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

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

  const handleSoundClick = () => {
    if (hasPurchased('soundEffects')) {
      togglePremiumSound();
    } else {
      setShowPremiumModal(true);
    }
  };

  const handleAmbientClick = () => {
    if (hasPurchased('ambientSound')) {
      toggleAmbient();
    } else {
      setShowPremiumModal(true);
    }
  };

  return (
    <div className="app">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="video-background"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay" />

      {/* Theme Toggle */}
      <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />

      {/* Premium Feature Toggles */}
      <div className="premium-toggles">
        {/* Dice/Coin Sound Effects Toggle */}
        <button
          className={`premium-toggle ${soundEnabled && hasPurchased('soundEffects') ? 'active' : ''} ${!hasPurchased('soundEffects') ? 'locked' : ''}`}
          onClick={handleSoundClick}
          aria-label={hasPurchased('soundEffects') ? 'Toggle dice sounds' : 'Unlock dice sounds'}
          title={hasPurchased('soundEffects') ? 'Dice Sounds' : 'Unlock Dice Sounds'}
        >
          {!hasPurchased('soundEffects') && <span className="lock-badge">PRO</span>}
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </button>

        {/* Ambient Fire Sound Toggle */}
        <button
          className={`premium-toggle ${ambientEnabled && hasPurchased('ambientSound') ? 'active' : ''} ${!hasPurchased('ambientSound') ? 'locked' : ''}`}
          onClick={handleAmbientClick}
          aria-label={hasPurchased('ambientSound') ? 'Toggle fire sounds' : 'Unlock fire sounds'}
          title={hasPurchased('ambientSound') ? 'Ambient Fire' : 'Unlock Ambient Fire'}
        >
          {!hasPurchased('ambientSound') && <span className="lock-badge">PRO</span>}
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22c3.31 0 6-2.69 6-6 0-2.5-1.5-4.5-3-6-1.5 1.5-3 3.5-3 6 0 1.1-.9 2-2 2s-2-.9-2-2c0-1.5.5-2.5 1-3.5.5-1 1-2 1-3.5 0-2.5-1.5-4.5-3-6-1.5 1.5-3 3.5-3 6 0 5.52 4.48 10 10 10z"/>
          </svg>
        </button>

        {/* Shop Button */}
        <button
          className="premium-toggle shop-button"
          onClick={() => setShowPremiumModal(true)}
          aria-label="Open premium shop"
          title="Premium Upgrades"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25 6 2.25v4.7zM9.5 12L8 13.5l3 3 5-5-1.5-1.5-3.5 3.5-1.5-1.5z"/>
          </svg>
        </button>
      </div>

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
          className="roll-button"
          onClick={handleAction}
          disabled={isRolling || isThrowing}
        >
          {getButtonText()}
        </button>
      </main>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </div>
  );
}

export default App;
