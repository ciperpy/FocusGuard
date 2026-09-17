import React from 'react';
import { History, Trash2, Calendar, Clock, Bell, ShieldAlert, X } from 'lucide-react';
import { formatDuration, formatDateTime, formatDurationFriendly } from '../utils/time';

export function HistoryView({ history, onDeleteSession, onClearHistory, onClose }) {
  const totalStudyTime = history.reduce((acc, curr) => acc + (curr.durationSec || 0), 0);
  const totalAlerts = history.reduce((acc, curr) => acc + (curr.drowsinessAlerts || 0), 0);
  const totalAlarms = history.reduce((acc, curr) => acc + (curr.alarmEvents || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="max-w-3xl w-full glass-panel p-6 sm:p-8 rounded-3xl border border-[#242832] space-y-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <History className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Study Session History</h2>
              <p className="text-xs text-slate-400">Stored locally in your browser.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aggregate Overview Metrics */}
        {history.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Total Sessions</div>
              <div className="text-xl font-bold text-white font-mono mt-0.5">{history.length}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Total Time Studied</div>
              <div className="text-xl font-bold text-indigo-300 font-mono mt-0.5">{formatDurationFriendly(totalStudyTime)}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Total Alerts</div>
              <div className="text-xl font-bold text-amber-300 font-mono mt-0.5">{totalAlerts}</div>
            </div>
          </div>
        )}

        {/* History List Table / Cards */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-400">No study sessions recorded yet.</p>
              <p className="text-xs text-slate-500">Completed study sessions will appear here.</p>
            </div>
          ) : (
            history.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{formatDateTime(session.startTime)}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 border border-white/5">
                      {session.mode === 'POMODORO' ? 'Pomodoro' : 'Free Study'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-mono text-white font-medium">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {formatDuration(session.durationSec)}
                    </span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <Bell className="w-3.5 h-3.5" />
                      {session.drowsinessAlerts} alerts
                    </span>
                    <span className="flex items-center gap-1 text-red-300">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {session.alarmEvents} alarms
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteSession(session.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors self-end sm:self-auto"
                  title="Delete Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="flex justify-between items-center border-t border-slate-800 pt-4">
            <button
              onClick={onClearHistory}
              className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
