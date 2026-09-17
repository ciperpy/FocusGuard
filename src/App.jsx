import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { CameraPreview } from './components/CameraPreview';
import { StudyTimer } from './components/StudyTimer';
import { DetectionStatusCard } from './components/DetectionStatusCard';
import { AlarmOverlay } from './components/AlarmOverlay';
import { CalibrationModal } from './components/CalibrationModal';
import { SessionStatsModal } from './components/SessionStatsModal';
import { HistoryView } from './components/HistoryView';
import { SettingsModal } from './components/SettingsModal';
import { PrivacyModal } from './components/PrivacyModal';
import { FocusModeOverlay } from './components/FocusModeOverlay';

import { useCamera } from './hooks/useCamera';
import { useStudyTimer } from './hooks/useStudyTimer';
import { useDrowsinessDetection } from './hooks/useDrowsinessDetection';
import { storageService } from './services/storageService';
import { initFaceLandmarker } from './services/faceDetectionService';
import { audioService } from './services/audioService';
import { DETECTION_STATES } from './utils/constants';

export default function App() {
  // Navigation & View states
  const [currentView, setCurrentView] = useState('LANDING'); // LANDING | STUDY
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Modal visibility
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // App Settings & History
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [history, setHistory] = useState(() => storageService.getHistory());
  const [sessionSummary, setSessionSummary] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  // Custom Hooks
  const { videoRef, cameraState, errorMessage, stream, startCamera, stopCamera } = useCamera();
  const {
    isRunning: isTimerRunning,
    totalSeconds,
    awakeMonitoringSeconds,
    pomodoroState,
    pomodoroSecondsLeft,
    pomodoroCyclesCompleted,
    startTimer,
    pauseTimer,
    resetTimer,
    incrementAwakeTime
  } = useStudyTimer(settings);

  const isSessionActive = currentView === 'STUDY';

  const {
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
  } = useDrowsinessDetection(settings, isSessionActive, !isTimerRunning);

  // Pre-initialize MediaPipe models on app load
  useEffect(() => {
    initFaceLandmarker().catch(err => console.warn('Pre-loading FaceLandmarker failed:', err));
  }, []);

  // Update awake monitoring seconds tick
  useEffect(() => {
    if (isSessionActive && isTimerRunning && detectionState === DETECTION_STATES.AWAKE) {
      incrementAwakeTime();
    }
  }, [isSessionActive, isTimerRunning, detectionState, incrementAwakeTime]);

  // Handle Save Settings
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
    audioService.setVolume(newSettings.alarmVolume);
  };

  // Start Study Session workflow
  const handleStartSession = async () => {
    // 1. Switch view to STUDY first so <CameraPreview> and <video> element mount in DOM
    setCurrentView('STUDY');
    setSessionStartTime(new Date().toISOString());

    // 2. Unlock browser AudioContext on user click gesture
    audioService.unlockAudioContext();
    audioService.setVolume(settings.alarmVolume);

    // 3. Load face detector model
    try {
      await initFaceLandmarker();
    } catch (e) {
      console.error('Failed to load FaceLandmarker on session start:', e);
    }

    // 4. Request webcam stream
    const cameraSuccess = await startCamera();
    if (cameraSuccess) {
      resetTimer();
      resetDetectionSession();
      startTimer();
      startCalibration();
    }
  };

  // Pause session
  const handlePauseSession = () => {
    pauseTimer();
    audioService.stopAlarm();
  };

  // Resume session
  const handleResumeSession = () => {
    startTimer();
  };

  // End Study Session workflow
  const handleEndSession = () => {
    audioService.stopAlarm();
    pauseTimer();
    stopCamera();

    const summary = {
      durationSec: totalSeconds,
      awakeMonitoringSec: awakeMonitoringSeconds,
      drowsinessAlerts,
      alarmEvents,
      startTime: sessionStartTime || new Date().toISOString(),
      endTime: new Date().toISOString(),
      mode: settings.pomodoroMode
    };

    setSessionSummary(summary);
    setShowStatsModal(true);
  };

  // Save session to history
  const handleSaveSessionStats = () => {
    if (sessionSummary) {
      const updatedHistory = storageService.saveSession(sessionSummary);
      setHistory(updatedHistory);
    }
    setShowStatsModal(false);
    setCurrentView('LANDING');
    setIsFocusMode(false);
    resetTimer();
  };

  const handleDiscardSessionStats = () => {
    setShowStatsModal(false);
    setCurrentView('LANDING');
    setIsFocusMode(false);
    resetTimer();
  };

  const handleDeleteSession = (sessionId) => {
    const updated = storageService.deleteSession(sessionId);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    const updated = storageService.clearHistory();
    setHistory(updated);
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        isSessionActive={isSessionActive}
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onToggleFocusMode={() => setIsFocusMode(prev => !prev)}
        isFocusMode={isFocusMode}
      />

      {/* Main Content Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* VIEW 1: LANDING PAGE */}
        {currentView === 'LANDING' && (
          <LandingView
            onStartSession={handleStartSession}
            onOpenPrivacy={() => setShowPrivacyModal(true)}
          />
        )}

        {/* VIEW 2: STUDY DASHBOARD */}
        {currentView === 'STUDY' && !isFocusMode && (
          <div className="space-y-6">
            
            {/* Top Dashboard Banner Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 sm:p-6 rounded-2xl border border-[#242832]">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  Active Study Session
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Camera is monitoring eye openness in real-time. Stay alert!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Detection Active</span>
                </span>
              </div>
            </div>

            {/* Main 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Camera Preview + Detection State (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <CameraPreview
                  videoRef={videoRef}
                  stream={stream}
                  cameraState={cameraState}
                  errorMessage={errorMessage}
                  onRetryCamera={startCamera}
                  detectionState={detectionState}
                  warningCountdownSec={warningCountdownSec}
                  isLowLight={isLowLight}
                  faceCount={faceCount}
                  onFrame={processFrame}
                  isCalibrating={isCalibrating}
                />

                <DetectionStatusCard
                  detectionState={detectionState}
                  currentEAR={currentEAR}
                  baselineEAR={baselineEAR}
                  settings={settings}
                  drowsinessAlerts={drowsinessAlerts}
                  alarmEvents={alarmEvents}
                  warningCountdownSec={warningCountdownSec}
                />
              </div>

              {/* Right Column: Study Timer & Controls (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                <StudyTimer
                  isRunning={isTimerRunning}
                  totalSeconds={totalSeconds}
                  onPause={handlePauseSession}
                  onResume={handleResumeSession}
                  onEndSession={handleEndSession}
                  settings={settings}
                  pomodoroState={pomodoroState}
                  pomodoroSecondsLeft={pomodoroSecondsLeft}
                  pomodoroCyclesCompleted={pomodoroCyclesCompleted}
                  onRecalibrate={startCalibration}
                />

                {/* Privacy & Safety Note */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
                  <div className="font-bold text-slate-300">Local Camera Privacy</div>
                  <p className="leading-relaxed text-[11px]">
                    Your camera stream is processed entirely within your browser via WASM. Video frames are never sent over the internet or saved.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* OVERLAY: Distraction-Free Focus Mode */}
      {currentView === 'STUDY' && isFocusMode && (
        <FocusModeOverlay
          onExitFocusMode={() => setIsFocusMode(false)}
          videoRef={videoRef}
          stream={stream}
          cameraState={cameraState}
          errorMessage={errorMessage}
          onRetryCamera={startCamera}
          detectionState={detectionState}
          warningCountdownSec={warningCountdownSec}
          isLowLight={isLowLight}
          faceCount={faceCount}
          onFrame={processFrame}
          isRunning={isTimerRunning}
          totalSeconds={totalSeconds}
          onPause={handlePauseSession}
          onResume={handleResumeSession}
          onEndSession={handleEndSession}
        />
      )}

      {/* OVERLAY: Urgent Alarm State Screen */}
      {detectionState === DETECTION_STATES.ALARM && (
        <AlarmOverlay onStopAlarm={triggerManualStopAlarm} />
      )}

      {/* MODAL: Calibration */}
      {isCalibrating && <CalibrationModal />}

      {/* MODAL: Session Statistics Summary */}
      {showStatsModal && (
        <SessionStatsModal
          sessionSummary={sessionSummary}
          onSaveAndClose={handleSaveSessionStats}
          onCloseWithoutSave={handleDiscardSessionStats}
        />
      )}

      {/* MODAL: History */}
      {showHistoryModal && (
        <HistoryView
          history={history}
          onDeleteSession={handleDeleteSession}
          onClearHistory={handleClearHistory}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {/* MODAL: Settings */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* MODAL: Privacy */}
      {showPrivacyModal && (
        <PrivacyModal onClose={() => setShowPrivacyModal(false)} />
      )}

    </div>
  );
}
