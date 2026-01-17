import { useCallback, useRef, useEffect } from 'react';
import { usePremium } from '../contexts/PremiumContext';

// Create sound effects using Web Audio API (no external files needed)
function createAudioContext() {
  return new (window.AudioContext || window.webkitAudioContext)();
}

// Soft, gentle tone with smooth fade
function playGentleTone(audioContext, frequency, duration, volume = 0.15, delay = 0) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  const startTime = audioContext.currentTime + delay;

  // Smooth envelope: fade in, sustain, fade out
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(volume, startTime + duration * 0.1);
  gainNode.gain.setValueAtTime(volume, startTime + duration * 0.6);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

// Soft chime sound - like a gentle bell
function playChime(audioContext, baseFreq, duration, volume = 0.12, delay = 0) {
  const startTime = audioContext.currentTime + delay;

  // Main tone
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.connect(gain1);
  gain1.connect(audioContext.destination);
  osc1.frequency.value = baseFreq;
  osc1.type = 'sine';
  gain1.gain.setValueAtTime(0, startTime);
  gain1.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gain1.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc1.start(startTime);
  osc1.stop(startTime + duration);

  // Soft harmonic overtone
  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  osc2.frequency.value = baseFreq * 2;
  osc2.type = 'sine';
  gain2.gain.setValueAtTime(0, startTime);
  gain2.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.02);
  gain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.7);
  osc2.start(startTime);
  osc2.stop(startTime + duration);
}

export function useSound() {
  const { soundEnabled, purchases } = usePremium();
  const audioContextRef = useRef(null);

  // Use refs to always have current values in callbacks
  const soundEnabledRef = useRef(soundEnabled);
  const purchasesRef = useRef(purchases);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    purchasesRef.current = purchases;
  }, [purchases]);

  // Initialize audio context on first user interaction
  const ensureAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = createAudioContext();
    }
    // Resume if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playDiceRoll = useCallback(() => {
    const isEnabled = soundEnabledRef.current;
    const hasSoundPurchased = purchasesRef.current?.soundEffects === true;

    if (!isEnabled || !hasSoundPurchased) return;

    const ctx = ensureAudioContext();

    // Calm rolling sound - gentle ascending tones like wind chimes
    // Soft tumbling sequence
    playGentleTone(ctx, 220, 0.3, 0.08, 0);
    playGentleTone(ctx, 262, 0.25, 0.07, 0.15);
    playGentleTone(ctx, 294, 0.25, 0.06, 0.3);
    playGentleTone(ctx, 330, 0.3, 0.07, 0.5);

    // Settling sound - soft resolution chord
    playChime(ctx, 392, 0.8, 0.1, 1.4);  // G
    playChime(ctx, 523, 0.6, 0.06, 1.45); // C (harmony)
  }, [ensureAudioContext]);

  const playCoinFlip = useCallback(() => {
    const isEnabled = soundEnabledRef.current;
    const hasSoundPurchased = purchasesRef.current?.soundEffects === true;

    if (!isEnabled || !hasSoundPurchased) return;

    const ctx = ensureAudioContext();

    // Gentle spinning whoosh - soft ascending shimmer
    playGentleTone(ctx, 440, 0.2, 0.05, 0);
    playGentleTone(ctx, 523, 0.2, 0.05, 0.12);
    playGentleTone(ctx, 587, 0.2, 0.05, 0.24);
    playGentleTone(ctx, 659, 0.25, 0.06, 0.4);

    // Landing - soft bell-like chime
    playChime(ctx, 784, 0.9, 0.12, 1.1);  // G5 - bright but soft
    playChime(ctx, 523, 0.7, 0.06, 1.15); // C5 - harmonic support
  }, [ensureAudioContext]);

  return {
    playDiceRoll,
    playCoinFlip,
    isEnabled: soundEnabled && purchases?.soundEffects === true,
  };
}
