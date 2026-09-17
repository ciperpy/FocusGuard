import { useState, useEffect, useRef, useCallback } from 'react';

export function useStudyTimer(settings) {
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [awakeMonitoringSeconds, setAwakeMonitoringSeconds] = useState(0);
  
  // Pomodoro state: 'STUDY' | 'SHORT_BREAK' | 'LONG_BREAK'
  const [pomodoroState, setPomodoroState] = useState('STUDY');
  const [pomodoroSecondsLeft, setPomodoroSecondsLeft] = useState(
    (settings?.studyDurationMin || 25) * 60
  );
  const [pomodoroCyclesCompleted, setPomodoroCyclesCompleted] = useState(0);

  const timerRef = useRef(null);

  // Sync initial pomodoro timer when settings change and timer is idle
  useEffect(() => {
    if (!isRunning && totalSeconds === 0) {
      setPomodoroSecondsLeft((settings?.studyDurationMin || 25) * 60);
    }
  }, [settings?.studyDurationMin, settings?.pomodoroMode, isRunning, totalSeconds]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTotalSeconds(0);
    setAwakeMonitoringSeconds(0);
    setPomodoroState('STUDY');
    setPomodoroSecondsLeft((settings?.studyDurationMin || 25) * 60);
    setPomodoroCyclesCompleted(0);
  }, [settings?.studyDurationMin]);

  const incrementAwakeTime = useCallback(() => {
    if (isRunning) {
      setAwakeMonitoringSeconds(prev => prev + 1);
    }
  }, [isRunning]);

  // Main 1-second interval loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTotalSeconds(prev => prev + 1);

        // Pomodoro interval management
        if (settings?.pomodoroMode === 'POMODORO') {
          setPomodoroSecondsLeft(prev => {
            if (prev <= 1) {
              // Cycle finished
              if (pomodoroState === 'STUDY') {
                const nextCycleCount = pomodoroCyclesCompleted + 1;
                setPomodoroCyclesCompleted(nextCycleCount);
                
                // Every 4th break is long break
                if (nextCycleCount % 4 === 0) {
                  setPomodoroState('LONG_BREAK');
                  return (settings?.longBreakMin || 15) * 60;
                } else {
                  setPomodoroState('SHORT_BREAK');
                  return (settings?.shortBreakMin || 5) * 60;
                }
              } else {
                // Break ended -> return to study
                setPomodoroState('STUDY');
                return (settings?.studyDurationMin || 25) * 60;
              }
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, pomodoroState, pomodoroCyclesCompleted, settings]);

  return {
    isRunning,
    totalSeconds,
    awakeMonitoringSeconds,
    pomodoroState,
    pomodoroSecondsLeft,
    pomodoroCyclesCompleted,
    startTimer,
    pauseTimer,
    resetTimer,
    incrementAwakeTime
  };
}
