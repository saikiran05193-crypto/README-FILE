/**
 * Emergency Audio Siren Engine
 * Manages audio alarms, looping sound files, Web Audio API synth fallbacks,
 * and browser audio permission state in localStorage.
 */

const SOUND_PERMISSION_KEY_1 = 'emergencySirenEnabled';
const SOUND_PERMISSION_KEY_2 = 'emergency_sound_enabled';

let currentAudio: HTMLAudioElement | null = null;
let audioCtx: AudioContext | null = null;
let activeOscillator1: OscillatorNode | null = null;
let activeOscillator2: OscillatorNode | null = null;
let synthLoopTimer: any = null;

export const isSoundEnabled = (): boolean => {
  return localStorage.getItem(SOUND_PERMISSION_KEY_1) === 'true' ||
         localStorage.getItem(SOUND_PERMISSION_KEY_2) === 'true';
};

export const setSoundEnabled = (enabled: boolean): void => {
  const value = enabled ? 'true' : 'false';
  localStorage.setItem(SOUND_PERMISSION_KEY_1, value);
  localStorage.setItem(SOUND_PERMISSION_KEY_2, value);
};

/**
 * Initializes and unlocks the browser audio context upon user gesture/button click.
 */
export const initializeAudioPermission = (): boolean => {
  setSoundEnabled(true);

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const dummyCtx = new AudioContextClass();
      if (dummyCtx.state === 'suspended') {
        dummyCtx.resume();
      }
      setTimeout(() => dummyCtx.close(), 100);
    }

    // Play and immediately pause a silent test sound to register user gesture
    const testAudio = new Audio('/sounds/emergency-siren.mp3');
    testAudio.volume = 0.01;
    testAudio.play().then(() => {
      testAudio.pause();
      testAudio.currentTime = 0;
    }).catch((err) => {
      console.warn('[Sound Engine] User gesture unlock note:', err.message);
    });

    return true;
  } catch (err) {
    console.warn('[Sound Engine] Audio initialization notice:', err);
    return true;
  }
};

/**
 * Plays the compulsory emergency siren in a continuous loop until acknowledged.
 */
export const playEmergencySiren = (): void => {
  // Always attempt siren when emergency occurs
  stopEmergencySiren();

  try {
    // Primary method: HTML5 Audio with emergency-siren.mp3
    currentAudio = new Audio('/sounds/emergency-siren.mp3');
    currentAudio.loop = true;
    currentAudio.volume = 1.0;

    const playPromise = currentAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('[Sound Engine] Audio file play blocked or failed. Starting Web Audio API synth loop fallback:', err.message);
        playSynthesizedSirenLoop();
      });
    }
  } catch (err) {
    console.warn('[Sound Engine] HTML5 Audio creation failed. Using Web Audio API synth loop fallback:', err);
    playSynthesizedSirenLoop();
  }
};

/**
 * Continuous Web Audio API synthesized dual-tone siren loop.
 */
export const playSynthesizedSirenLoop = (): void => {
  stopSynthesizedSiren();

  const playTonePulse = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      activeOscillator1 = audioCtx.createOscillator();
      activeOscillator2 = audioCtx.createOscillator();

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.4, now);

      activeOscillator1.type = 'sawtooth';
      activeOscillator2.type = 'sine';

      // Alternating high-low emergency frequencies (880Hz / 660Hz)
      activeOscillator1.frequency.setValueAtTime(960, now);
      activeOscillator1.frequency.setValueAtTime(770, now + 0.4);

      activeOscillator2.frequency.setValueAtTime(480, now);

      activeOscillator1.connect(gainNode);
      activeOscillator2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      activeOscillator1.start(now);
      activeOscillator2.start(now);

      activeOscillator1.stop(now + 0.8);
      activeOscillator2.stop(now + 0.8);
    } catch (err) {
      console.warn('[Sound Engine] Synth loop error:', err);
    }
  };

  playTonePulse();
  synthLoopTimer = setInterval(playTonePulse, 850);
};

export const playSynthesizedSiren = playSynthesizedSirenLoop;

const stopSynthesizedSiren = (): void => {
  if (synthLoopTimer) {
    clearInterval(synthLoopTimer);
    synthLoopTimer = null;
  }
  if (activeOscillator1) {
    try { activeOscillator1.stop(); } catch (e) {}
    activeOscillator1 = null;
  }
  if (activeOscillator2) {
    try { activeOscillator2.stop(); } catch (e) {}
    activeOscillator2 = null;
  }
  if (audioCtx) {
    try { audioCtx.close(); } catch (e) {}
    audioCtx = null;
  }
};

/**
 * Stops the siren immediately when Viewer acknowledges the alert.
 */
export const stopEmergencySiren = (): void => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  stopSynthesizedSiren();
};
