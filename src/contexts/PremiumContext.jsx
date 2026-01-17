import { createContext, useContext, useState, useEffect } from 'react';

const PremiumContext = createContext();

const STORAGE_KEY = 'dice-app-premium';
const ENABLED_KEY = 'dice-app-enabled';

const DEFAULT_PURCHASES = {
  soundEffects: false,  // Premium feature - dice/coin sounds
  ambientSound: false,  // Premium feature - crackling fire
};

const DEFAULT_ENABLED = {
  sound: false,
  ambient: false,
};

export function PremiumProvider({ children }) {
  const [purchases, setPurchases] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PURCHASES;
  });

  // Feature active states (can be toggled on/off if purchased) - also persisted
  const [enabledStates, setEnabledStates] = useState(() => {
    const stored = localStorage.getItem(ENABLED_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_ENABLED;
  });

  const soundEnabled = enabledStates.sound;
  const ambientEnabled = enabledStates.ambient;

  const setSoundEnabled = (value) => {
    const newValue = typeof value === 'function' ? value(enabledStates.sound) : value;
    setEnabledStates(prev => ({ ...prev, sound: newValue }));
  };

  const setAmbientEnabled = (value) => {
    const newValue = typeof value === 'function' ? value(enabledStates.ambient) : value;
    setEnabledStates(prev => ({ ...prev, ambient: newValue }));
  };

  // Persist purchases to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
  }, [purchases]);

  // Persist enabled states to localStorage
  useEffect(() => {
    localStorage.setItem(ENABLED_KEY, JSON.stringify(enabledStates));
  }, [enabledStates]);

  const purchaseFeature = (feature) => {
    setPurchases(prev => ({
      ...prev,
      [feature]: true
    }));
    // Auto-enable the feature after purchase
    if (feature === 'soundEffects') {
      setSoundEnabled(true);
    } else if (feature === 'ambientSound') {
      setAmbientEnabled(true);
    }
  };

  const hasPurchased = (feature) => purchases[feature] === true;

  const toggleSound = () => {
    if (hasPurchased('soundEffects')) {
      setSoundEnabled(prev => !prev);
    }
  };

  const toggleAmbient = () => {
    if (hasPurchased('ambientSound')) {
      setAmbientEnabled(prev => !prev);
    }
  };

  const value = {
    purchases,
    purchaseFeature,
    hasPurchased,
    soundEnabled,
    setSoundEnabled,
    toggleSound,
    ambientEnabled,
    setAmbientEnabled,
    toggleAmbient,
  };

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}
