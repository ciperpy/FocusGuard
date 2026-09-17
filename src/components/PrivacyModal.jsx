import React from 'react';
import { Lock, ShieldCheck, ServerOff, Database, AlertCircle, X } from 'lucide-react';

export function PrivacyModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="max-w-lg w-full glass-panel p-6 sm:p-8 rounded-3xl border border-[#242832] space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Privacy & Local Processing</h2>
              <p className="text-xs text-slate-400">Our privacy-first commitment to students.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guarantees List */}
        <div className="space-y-3 text-xs text-slate-300">
          
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm mb-0.5">100% Client-Side Processing</strong>
              Facial landmark detection runs completely inside your browser using WebAssembly. No video frames ever leave your device.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <ServerOff className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm mb-0.5">Zero Video Storage or Uploads</strong>
              We do not record, store, transmit, or analyze camera footage on any remote server or cloud service.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <Database className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm mb-0.5">Local Browser Storage Only</strong>
              Session statistics (duration, alert count) are saved exclusively to your browser&apos;s local storage. You can clear them at any time.
            </div>
          </div>

        </div>

        {/* Non-Medical Disclaimer */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Productivity Disclaimer</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-200/80">
            FocusGuard is a student focus and study productivity tool, not a medical device. It does not diagnose fatigue, sleep disorders, or medical conditions.
          </p>
        </div>

        {/* Close button */}
        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Got it, thanks
          </button>
        </div>

      </div>
    </div>
  );
}
