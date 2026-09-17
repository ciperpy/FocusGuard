export const DETECTION_STATES = {
  AWAKE: 'AWAKE',
  POSSIBLE_BLINK: 'POSSIBLE_BLINK',
  WARNING: 'WARNING',
  ALARM: 'ALARM',
  FACE_NOT_DETECTED: 'FACE_NOT_DETECTED',
  MULTIPLE_FACES: 'MULTIPLE_FACES',
  CALIBRATING: 'CALIBRATING',
  PAUSED: 'PAUSED',
  CAMERA_ERROR: 'CAMERA_ERROR'
};

export const SENSITIVITY_PRESETS = {
  LOW: {
    label: 'Low Sensitivity',
    description: 'Permits longer eye closure before alerting (For late night high-focus studying)',
    earThreshold: 0.18,
    warningDurationSec: 2.5,
    alarmDurationSec: 4.0
  },
  MEDIUM: {
    label: 'Medium Sensitivity (Recommended)',
    description: 'Balanced detection for standard study sessions',
    earThreshold: 0.22,
    warningDurationSec: 1.8,
    alarmDurationSec: 3.0
  },
  HIGH: {
    label: 'High Sensitivity',
    description: 'Strict alerts for early drowsiness detection',
    earThreshold: 0.26,
    warningDurationSec: 1.2,
    alarmDurationSec: 2.0
  },
  CUSTOM: {
    label: 'Custom',
    description: 'User-configured custom sensitivity thresholds'
  }
};

export const ALARM_SOUNDS = {
  GENTLE_BEEP: {
    id: 'GENTLE_BEEP',
    name: 'Gentle Beep',
    description: 'Soft harmonic chime for light waking'
  },
  DIGITAL_ALARM: {
    id: 'DIGITAL_ALARM',
    name: 'Digital Alarm',
    description: 'Classic electronic repeating pulse'
  },
  STRONG_WAKEUP: {
    id: 'STRONG_WAKEUP',
    name: 'Strong Wake-Up Alarm',
    description: 'Urgent dual-tone siren for deep drowsiness'
  }
};

export const POMODORO_MODES = {
  FREE_STUDY: {
    id: 'FREE_STUDY',
    name: 'Free Study Mode',
    description: 'Continuous session without structured break timers'
  },
  POMODORO: {
    id: 'POMODORO',
    name: 'Pomodoro Mode',
    description: 'Structured study intervals (e.g. 25m study / 5m break)'
  }
};

export const DEFAULT_SETTINGS = {
  sensitivityPreset: 'MEDIUM',
  earThreshold: 0.22,
  blinkToleranceMs: 700,
  warningDurationSec: 1.8,
  alarmDurationSec: 3.0,
  alarmSound: 'STRONG_WAKEUP',
  alarmVolume: 80,
  enableAlarm: true,
  pomodoroMode: 'FREE_STUDY',
  studyDurationMin: 25,
  shortBreakMin: 5,
  longBreakMin: 15,
  showLandmarksOverlay: true,
  autoStartOnCameraReady: false
};
