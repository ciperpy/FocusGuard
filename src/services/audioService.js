/**
 * Audio Synthesizer service using HTML5 Web Audio API
 * Generates custom alarm sounds client-side without external media files.
 */

class AudioService {
  constructor() {
    this.audioCtx = null;
    this.activeOscillators = [];
    this.masterGainNode = null;
    this.isPlaying = false;
    this.intervalId = null;
    this.volume = 0.9; // 0.0 to 1.0
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.masterGainNode = this.audioCtx.createGain();
        this.masterGainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
        this.masterGainNode.connect(this.audioCtx.destination);
      }
    }
  }

  unlockAudioContext() {
    this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(e => console.warn('AudioContext resume warning:', e));
    }
  }

  setVolume(volumePercent) {
    this.volume = Math.max(0, Math.min(1, (volumePercent ?? 90) / 100));
    if (this.masterGainNode && this.audioCtx) {
      this.masterGainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  playAlarm(soundType = 'STRONG_WAKEUP') {
    this.unlockAudioContext();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.masterGainNode) {
      this.masterGainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }

    this.stopAlarm(); // Stop any currently playing audio
    this.isPlaying = true;

    if (soundType === 'GENTLE_BEEP') {
      this._playGentleBeepLoop();
    } else if (soundType === 'DIGITAL_ALARM') {
      this._playDigitalAlarmLoop();
    } else {
      this._playStrongWakeupLoop();
    }
  }

  stopAlarm() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Ignored
      }
    });
    this.activeOscillators = [];
  }

  testSound(soundType = 'STRONG_WAKEUP', durationMs = 1800) {
    this.playAlarm(soundType);
    setTimeout(() => {
      this.stopAlarm();
    }, durationMs);
  }

  // --- PRIVATE SOUND SYNTHESIS LOOPS ---

  _playGentleBeepLoop() {
    const playChime = () => {
      if (!this.isPlaying || !this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.3); // E5

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGainNode);

      osc.start(now);
      osc.stop(now + 0.55);
      this.activeOscillators.push(osc);
    };

    playChime();
    this.intervalId = setInterval(() => {
      if (this.isPlaying) playChime();
    }, 700);
  }

  _playDigitalAlarmLoop() {
    const playBeep = () => {
      if (!this.isPlaying || !this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      
      for (let i = 0; i < 3; i++) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const startTime = now + i * 0.14;
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, startTime); // A5

        gain.gain.setValueAtTime(0.5, startTime);
        gain.gain.setValueAtTime(0, startTime + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGainNode);

        osc.start(startTime);
        osc.stop(startTime + 0.09);
        this.activeOscillators.push(osc);
      }
    };

    playBeep();
    this.intervalId = setInterval(() => {
      if (this.isPlaying) playBeep();
    }, 750);
  }

  _playStrongWakeupLoop() {
    const playSiren = () => {
      if (!this.isPlaying || !this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      osc1.frequency.setValueAtTime(750, now);
      osc1.frequency.linearRampToValueAtTime(1200, now + 0.2);
      osc1.frequency.linearRampToValueAtTime(750, now + 0.4);

      osc2.frequency.setValueAtTime(1200, now);
      osc2.frequency.linearRampToValueAtTime(750, now + 0.2);
      osc2.frequency.linearRampToValueAtTime(1200, now + 0.4);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGainNode);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.48);
      osc2.stop(now + 0.48);

      this.activeOscillators.push(osc1, osc2);
    };

    playSiren();
    this.intervalId = setInterval(() => {
      if (this.isPlaying) playSiren();
    }, 500);
  }
}

export const audioService = new AudioService();
