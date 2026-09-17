import React from 'react';
import { ShieldAlert, VolumeX, Eye } from 'lucide-react';

export function AlarmOverlay({ onStopAlarm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-pulse-alarm">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border-2 border-red-500 shadow-2xl shadow-red-600/50 text-center space-y-6 transform animate-bounce-short">
        
        {/* Urgent Pulsing Alarm Icon */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-600/30 border-2 border-red-500 text-red-500 animate-pulse">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>

        {/* Alarm Headline */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wider uppercase animate-pulse">
            WAKE UP!
          </h2>
          <p className="text-sm font-semibold text-red-200">
            Your eyes have been closed for too long.
          </p>
        </div>

        <p className="text-xs text-red-300/80 bg-red-900/40 p-3 rounded-xl border border-red-500/20">
          The alarm will automatically stop when you open your eyes, or click below.
        </p>

        {/* Manual Stop Button */}
        <div className="pt-2">
          <button
            onClick={onStopAlarm}
            className="w-full py-4 rounded-2xl bg-white hover:bg-slate-100 text-red-600 font-extrabold text-base shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <VolumeX className="w-5 h-5 text-red-600" />
            <span>STOP ALARM</span>
          </button>
        </div>

      </div>
    </div>
  );
}
