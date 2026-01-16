import { useState, useRef, useCallback, useEffect } from 'react';
import Dice from './components/Dice';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [isThrowing, setIsThrowing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const diceRef = useRef(null);

  // Detect system preference on mount
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const rollDice = useCallback(() => {
    if (isRolling || isThrowing) return;

    // Start throwing and rolling simultaneously
    setIsThrowing(true);
    setIsRolling(true);

    // Generate random result
    const result = Math.floor(Math.random() * 6) + 1;

    // Wait for animation to complete before showing result
    setTimeout(() => {
      setDiceValue(result);
      setIsRolling(false);
      setIsThrowing(false);
    }, 2000);
  }, [isRolling, isThrowing]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  return (
    <div className="app">
      {/* Video Background */}
      <video
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

      {/* Dice on the table */}
      <div className="dice-area">
        <Dice
          ref={diceRef}
          value={diceValue}
          isRolling={isRolling}
          isThrowing={isThrowing}
        />
      </div>

      {/* Button at bottom */}
      <main className="content">
        <button
          className="roll-button"
          onClick={rollDice}
          disabled={isRolling || isThrowing}
        >
          {isRolling ? 'Rolling...' : 'Roll the Dice'}
        </button>
      </main>
    </div>
  );
}

export default App;
