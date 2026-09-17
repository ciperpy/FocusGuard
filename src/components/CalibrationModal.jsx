import React from 'react';
import { Eye, RefreshCw, CheckCircle2 } from 'lucide-react';

export function CalibrationModal() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="max-w-sm w-full glass-panel-glow p-6 rounded-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto animate-spin">
          <RefreshCw className="w-6 h-6 text-indigo-400" />
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-white text-lg">Calibrating...</h3>
          <p className="text-xs text-slate-300">
            Please look directly at your screen normally for 2-3 seconds.
          </p>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-indigo-500 h-full w-full animate-pulse" />
        </div>

        <p className="text-[11px] text-slate-400">
          Establishing personalized baseline eye aspect ratio.
        </p>
      </div>
    </div>
  );
}
