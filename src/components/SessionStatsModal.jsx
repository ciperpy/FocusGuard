import React from 'react';
import { Award, Clock, Bell, ShieldAlert, CheckCircle2, RotateCcw, Save } from 'lucide-react';
import { formatDuration, formatDateTime } from '../utils/time';

export function SessionStatsModal({ sessionSummary, onSaveAndClose, onCloseWithoutSave }) {
  if (!sessionSummary) return null;

  const {
    durationSec,
    awakeMonitoringSec,
    drowsinessAlerts,
    alarmEvents,
    startTime,
    endTime,
    mode
  } = sessionSummary;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="max-w-lg w-full glass-panel-glow p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <Award className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Session Complete!</h2>
          <p className="text-xs text-slate-300">
            Great work staying focused. Here is your study session summary.
          </p>
        </div>

        {/* Primary Stat Highlight */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/60 border border-indigo-500/30 text-center">
          <div className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">
            Total Study Duration
          </div>
          <div className="font-mono text-4xl font-extrabold text-white mt-1">
            {formatDuration(durationSec)}
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-3">
          
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Drowsiness Alerts</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {drowsinessAlerts}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Detected eye-closures</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Alarm Triggers</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {alarmEvents}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Wake-up sound alerts</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Awake Time</span>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
              {formatDuration(awakeMonitoringSec)}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Active monitoring</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Session Mode</span>
            </div>
            <div className="text-sm font-bold text-slate-200 mt-1.5">
              {mode === 'POMODORO' ? 'Pomodoro Mode' : 'Free Study'}
            </div>
          </div>

        </div>

        {/* Timestamps */}
        <div className="text-center text-[11px] text-slate-400 space-y-0.5 border-t border-slate-800 pt-3">
          <div>Started: {formatDateTime(startTime)}</div>
          <div>Finished: {formatDateTime(endTime)}</div>
        </div>

        {/* Non-medical Disclaimer */}
        <p className="text-[10px] text-slate-500 text-center leading-relaxed">
          * FocusGuard measurements reflect browser facial eye tracking and are for personal productivity tracking only.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onSaveAndClose}
            className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save to History</span>
          </button>

          <button
            onClick={onCloseWithoutSave}
            className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-white/10 transition-colors"
          >
            Discard
          </button>
        </div>

      </div>
    </div>
  );
}
