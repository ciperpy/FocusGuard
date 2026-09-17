import React from 'react';
import { Shield, Eye, Clock, History, Settings, Lock, Maximize2, Sparkles } from 'lucide-react';

export function Navbar({
  isSessionActive,
  onOpenHistory,
  onOpenSettings,
  onOpenPrivacy,
  onToggleFocusMode,
  isFocusMode
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
            <Shield className="w-5 h-5 text-white" />
            <Eye className="w-3 h-3 text-indigo-200 absolute inset-0 m-auto" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                FocusGuard
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full uppercase">
                AI MVP
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              AI Anti-Sleep Study Companion
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Privacy badge */}
          <button
            onClick={onOpenPrivacy}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            title="View Local Privacy Guarantees"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Local Camera Processing</span>
          </button>

          {/* Focus mode toggle (Only if session is active) */}
          {isSessionActive && (
            <button
              onClick={onToggleFocusMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isFocusMode
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-white/10'
              }`}
              title="Toggle Distraction-Free Focus Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Focus Mode</span>
            </button>
          )}

          {/* History trigger */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/70 hover:bg-slate-700/80 border border-white/10 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>History</span>
          </button>

          {/* Settings trigger */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/70 hover:bg-slate-700/80 border border-white/10 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

      </div>
    </header>
  );
}
