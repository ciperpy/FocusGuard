import React from 'react';
import { Minimize2, Play, Pause, Square, Shield } from 'lucide-react';
import { CameraPreview } from './CameraPreview';
import { formatDuration } from '../utils/time';

export function FocusModeOverlay({
  onExitFocusMode,
  videoRef,
  stream,
  cameraState,
  errorMessage,
  onRetryCamera,
  detectionState,
  warningCountdownSec,
  isLowLight,
  faceCount,
  onFrame,
  isRunning,
  totalSeconds,
  onPause,
  onResume,
  onEndSession
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[#08090D] flex flex-col justify-between p-4 sm:p-8 animate-fade-in overflow-y-auto">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          <span className="font-extrabold text-lg text-white">FocusGuard</span>
          <span className="px-2 py-0.5 text-[10px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            Distraction-Free Mode
          </span>
        </div>

        <button
          onClick={onExitFocusMode}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
        >
          <Minimize2 className="w-4 h-4" />
          <span>Exit Focus Mode</span>
        </button>
      </div>

      {/* Main Focus Content Grid */}
      <div className="max-w-4xl w-full mx-auto my-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Left: Camera Feed */}
        <div className="w-full">
          <CameraPreview
            videoRef={videoRef}
            stream={stream}
            cameraState={cameraState}
            errorMessage={errorMessage}
            onRetryCamera={onRetryCamera}
            detectionState={detectionState}
            warningCountdownSec={warningCountdownSec}
            isLowLight={isLowLight}
            faceCount={faceCount}
            onFrame={onFrame}
          />
        </div>

        {/* Right: Massive Digital Timer & Controls */}
        <div className="glass-panel p-8 rounded-3xl border border-[#242832] flex flex-col items-center text-center space-y-8">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Study Duration
            </div>
            <div className="font-mono text-6xl sm:text-7xl font-extrabold text-white tracking-tight">
              {formatDuration(totalSeconds)}
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-4 w-full">
            {isRunning ? (
              <button
                onClick={onPause}
                className="flex-1 py-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-base transition-all flex items-center justify-center gap-2"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={onResume}
                className="flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Resume</span>
              </button>
            )}

            <button
              onClick={onEndSession}
              className="py-4 px-6 rounded-2xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 hover:border-red-500/30 font-bold text-base transition-all flex items-center justify-center gap-2"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>End</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Hint */}
      <div className="text-center text-xs text-slate-500">
        Camera monitoring remains active in distraction-free mode.
      </div>

    </div>
  );
}
