import React from 'react';
import { Play, Pause, Square, Coffee, Flame, RotateCcw } from 'lucide-react';
import { formatDuration } from '../utils/time';

export function StudyTimer({
  isRunning,
  totalSeconds,
  onPause,
  onResume,
  onEndSession,
  settings,
  pomodoroState,
  pomodoroSecondsLeft,
  pomodoroCyclesCompleted,
  onRecalibrate
}) {
  const isPomodoro = settings?.pomodoroMode === 'POMODORO';

  return (
    <div className="glass-panel p-6 rounded-2xl border border-[#242832] flex flex-col justify-between space-y-6">
      
      {/* Top Header & Mode Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPomodoro ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
              <Coffee className="w-3.5 h-3.5 text-purple-400" />
              <span>Pomodoro Mode</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-indigo-400" />
              <span>Free Study Mode</span>
            </span>
          )}
        </div>

        {/* Recalibrate button */}
        {onRecalibrate && (
          <button
            onClick={onRecalibrate}
            className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            title="Recalibrate Eye Openness Baseline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Recalibrate</span>
          </button>
        )}
      </div>

      {/* Main Digital Timer Readout */}
      <div className="text-center py-2">
        <div className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
          {formatDuration(totalSeconds)}
        </div>
        <p className="text-xs text-slate-400 font-medium mt-2">
          Total Study Elapsed Time
        </p>
      </div>

      {/* Pomodoro Sub-Timer (If active) */}
      {isPomodoro && (
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">
              {pomodoroState === 'STUDY' ? 'Focus Interval' : 'Break Time'}
            </span>
            <span className="font-mono text-indigo-400 font-bold">
              {formatDuration(pomodoroSecondsLeft)}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                pomodoroState === 'STUDY' ? 'bg-indigo-500' : 'bg-emerald-500'
              }`}
              style={{
                width: `${
                  100 -
                  (pomodoroSecondsLeft /
                    ((pomodoroState === 'STUDY'
                      ? settings.studyDurationMin
                      : settings.shortBreakMin) *
                      60)) *
                    100
                }%`
              }}
            />
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {isRunning ? (
          <button
            onClick={onPause}
            className="w-full py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Pause className="w-4 h-4" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={onResume}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Resume</span>
          </button>
        )}

        <button
          onClick={onEndSession}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 hover:border-red-500/30 font-bold text-sm transition-all flex items-center justify-center gap-2"
        >
          <Square className="w-4 h-4 fill-current" />
          <span>End Session</span>
        </button>
      </div>

    </div>
  );
}
