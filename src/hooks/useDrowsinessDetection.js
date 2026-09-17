import { useState, useRef, useCallback, useEffect } from 'react';
import { DETECTION_STATES, SENSITIVITY_PRESETS } from '../utils/constants';
import { calculateAverageEAR, extractBlinkBlendshapes, calculateFrameBrightness } from '../utils/eyeDetection';
import { detectFaceLandmarks, drawEyeMeshOverlay } from '../services/faceDetectionService';
import { audioService } from '../services/audioService';

export function useDrowsinessDetection(settings, isSessionActive, isPaused) {
  const [detectionState, setDetectionState] = useState(DETECTION_STATES.AWAKE);
  const [currentEAR, setCurrentEAR] = useState(0.28);
  const [baselineEAR, setBaselineEAR] = useState(null);
  const [isLowLight, setIsLowLight] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  
  // Stats counters for current session
  const [drowsinessAlerts, setDrowsinessAlerts] = useState(0);
  const [alarmEvents, setAlarmEvents] = useState(0);
  const [warningCountdownSec, setWarningCountdownSec] = useState(0);

  // Calibration state
  const [isCalibrating, setIsCalibrating] = useState(false);
  const calibrationSamples = useRef([]);

  // Temporal detection timers & references
  const eyesClosedStartTime = useRef(null);
  const lastProcessTime = useRef(0);
  const hasTriggeredWarningForCurrentClosure = useRef(false);
  const hasTriggeredAlarmForCurrentClosure = useRef(false);

  // Reset counters when session starts
  const resetDetectionSession = useCallback(() => {
    setDrowsinessAlerts(0);
    setAlarmEvents(0);
    setDetectionState(DETECTION_STATES.AWAKE);
    eyesClosedStartTime.current = null;
    hasTriggeredWarningForCurrentClosure.current = false;
    hasTriggeredAlarmForCurrentClosure.current = false;
    audioService.stopAlarm();
  }, []);

  const triggerManualStopAlarm = useCallback(() => {
    audioService.stopAlarm();
    setDetectionState(DETECTION_STATES.AWAKE);
    eyesClosedStartTime.current = null;
  }, []);

  const startCalibration = useCallback(() => {
    setIsCalibrating(true);
    setDetectionState(DETECTION_STATES.CALIBRATING);
    calibrationSamples.current = [];
    setTimeout(() => {
      if (calibrationSamples.current.length > 0) {
        const avg = calibrationSamples.current.reduce((a, b) => a + b, 0) / calibrationSamples.current.length;
        // Set calibrated threshold to ~70% of average open-eye EAR
        const targetThreshold = Math.max(0.14, Math.min(0.25, avg * 0.70));
        setBaselineEAR(targetThreshold);
      }
      setIsCalibrating(false);
      setDetectionState(DETECTION_STATES.AWAKE);
    }, 2500);
  }, []);

  // Main processing loop on webcam canvas
  const processFrame = useCallback((videoElement, canvasElement, timestamp) => {
    if (!isSessionActive || isPaused || !videoElement || videoElement.readyState < 2) {
      if (canvasElement) {
        const ctx = canvasElement.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      }
      return;
    }

    // Limit detection frequency to ~15-20 FPS (every 50ms) to conserve CPU
    if (timestamp - lastProcessTime.current < 50) {
      return;
    }
    lastProcessTime.current = timestamp;

    const canvasCtx = canvasElement ? canvasElement.getContext('2d') : null;
    if (canvasElement && videoElement) {
      if (canvasElement.width !== videoElement.videoWidth) canvasElement.width = videoElement.videoWidth;
      if (canvasElement.height !== videoElement.videoHeight) canvasElement.height = videoElement.videoHeight;
    }

    // Run MediaPipe Face Landmarker
    const results = detectFaceLandmarks(videoElement, timestamp);
    const now = Date.now();

    // Check light level
    if (canvasCtx && canvasElement) {
      const brightness = calculateFrameBrightness(canvasElement, canvasCtx);
      setIsLowLight(brightness < 40);
    }

    // 1. NO FACE DETECTED
    if (!results || !results.faceLandmarks || results.faceLandmarks.length === 0) {
      setFaceCount(0);
      if (!isCalibrating) {
        setDetectionState(DETECTION_STATES.FACE_NOT_DETECTED);
        eyesClosedStartTime.current = null;
        hasTriggeredWarningForCurrentClosure.current = false;
        hasTriggeredAlarmForCurrentClosure.current = false;
        audioService.stopAlarm();
      }
      if (canvasCtx && canvasElement) {
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      }
      return;
    }

    // 2. MULTIPLE FACES DETECTED
    const numFaces = results.faceLandmarks.length;
    setFaceCount(numFaces);
    if (numFaces > 1 && !isCalibrating) {
      setDetectionState(DETECTION_STATES.MULTIPLE_FACES);
    }

    // Analyze primary face (closest / index 0)
    const primaryFaceLandmarks = results.faceLandmarks[0];
    const blendshapes = results.faceBlendshapes ? results.faceBlendshapes[0] : null;

    // Calculate Eye Aspect Ratio (EAR)
    const ear = calculateAverageEAR(primaryFaceLandmarks);
    setCurrentEAR(ear);

    // Extract blendshape blink score
    const { avgBlinkScore } = extractBlinkBlendshapes(blendshapes);

    // Baseline calibration phase sampling
    if (isCalibrating) {
      if (ear > 0.12) {
        calibrationSamples.current.push(ear);
      }
      if (settings.showLandmarksOverlay && canvasCtx && canvasElement) {
        drawEyeMeshOverlay(canvasCtx, primaryFaceLandmarks, canvasElement.width, canvasElement.height, 'CALIBRATING');
      }
      return;
    }

    // Dynamic threshold determination
    let activeThreshold = 0.20; // Default sensible fallback
    if (settings.sensitivityPreset === 'CUSTOM') {
      activeThreshold = settings.earThreshold || 0.20;
    } else if (baselineEAR !== null) {
      activeThreshold = baselineEAR;
    } else {
      const preset = SENSITIVITY_PRESETS[settings.sensitivityPreset];
      activeThreshold = preset?.earThreshold || 0.20;
    }

    // Eye closed condition: EAR drops below threshold OR high blendshape blink score
    const isEyesClosed = (ear > 0 && ear < activeThreshold) || avgBlinkScore > 0.45;

    // 3. EYES ARE OPEN -> AWAKE STATE
    if (!isEyesClosed) {
      if (eyesClosedStartTime.current !== null) {
        audioService.stopAlarm();
      }
      eyesClosedStartTime.current = null;
      hasTriggeredWarningForCurrentClosure.current = false;
      hasTriggeredAlarmForCurrentClosure.current = false;
      setWarningCountdownSec(0);
      
      if (numFaces <= 1) {
        setDetectionState(DETECTION_STATES.AWAKE);
      }
    } else {
      // 4. EYES ARE CLOSED
      if (eyesClosedStartTime.current === null) {
        eyesClosedStartTime.current = now;
      }

      const closedDurationMs = now - eyesClosedStartTime.current;
      const blinkToleranceMs = settings.blinkToleranceMs || 700;
      const warningThresholdMs = (settings.warningDurationSec || 1.8) * 1000;
      const alarmThresholdMs = (settings.alarmDurationSec || 3.0) * 1000;

      if (closedDurationMs < blinkToleranceMs) {
        // Normal blink range
        setDetectionState(DETECTION_STATES.POSSIBLE_BLINK);
      } else if (closedDurationMs >= blinkToleranceMs && closedDurationMs < alarmThresholdMs) {
        // WARNING STATE
        setDetectionState(DETECTION_STATES.WARNING);
        const remainingToAlarm = Math.max(0, (alarmThresholdMs - closedDurationMs) / 1000);
        setWarningCountdownSec(remainingToAlarm);

        if (!hasTriggeredWarningForCurrentClosure.current) {
          hasTriggeredWarningForCurrentClosure.current = true;
          setDrowsinessAlerts(prev => prev + 1);
        }
      } else if (closedDurationMs >= alarmThresholdMs) {
        // ALARM STATE
        setDetectionState(DETECTION_STATES.ALARM);
        setWarningCountdownSec(0);

        if (!hasTriggeredAlarmForCurrentClosure.current) {
          hasTriggeredAlarmForCurrentClosure.current = true;
          setAlarmEvents(prev => prev + 1);
          if (settings.enableAlarm !== false) {
            audioService.playAlarm(settings.alarmSound || 'STRONG_WAKEUP');
          }
        }
      }
    }

    // Render facial mesh overlay on canvas
    if (settings.showLandmarksOverlay && canvasCtx && canvasElement) {
      drawEyeMeshOverlay(canvasCtx, primaryFaceLandmarks, canvasElement.width, canvasElement.height, detectionState);
    }
  }, [
    isSessionActive,
    isPaused,
    isCalibrating,
    baselineEAR,
    settings,
    detectionState
  ]);

  // Clean up audio on unmount or pause
  useEffect(() => {
    if (!isSessionActive || isPaused) {
      audioService.stopAlarm();
    }
  }, [isSessionActive, isPaused]);

  return {
    detectionState,
    currentEAR,
    baselineEAR,
    isLowLight,
    faceCount,
    drowsinessAlerts,
    alarmEvents,
    warningCountdownSec,
    isCalibrating,
    processFrame,
    resetDetectionSession,
    triggerManualStopAlarm,
    startCalibration
  };
}
