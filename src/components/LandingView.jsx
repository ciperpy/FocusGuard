import React from 'react';
import { Eye, Shield, Bell, LineChart, Lock, Play, Sparkles, CheckCircle2, Zap, ArrowRight, Activity, Cpu } from 'lucide-react';

export function LandingView({ onStartSession, onOpenPrivacy }) {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden">
      
      {/* Subtle Background Radial & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2430_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-[450px] h-[450px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Main Hero & Content Section */}
      <div className="relative max-w-5xl w-full mx-auto px-4 pt-8 pb-16 sm:py-16 flex flex-col items-center text-center space-y-12 z-10">
        
        {/* Top Feature Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-xl shadow-indigo-500/5 backdrop-blur-md transition-all hover:border-indigo-500/50">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Real-Time Browser Facial Vision</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        {/* Hero Headlines */}
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Stay Awake.{' '}
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              Stay Focused.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
            An AI-powered study companion that monitors eye alertness in real-time, helping students remain awake and focused during long study sessions.
          </p>
        </div>

        {/* Main CTA Button & Quick Info */}
        <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onStartSession}
            className="w-full sm:w-auto px-9 py-4.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold text-lg shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-indigo-400/30 group cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white group-hover:translate-x-0.5 transition-transform" />
            <span>Start Study Session</span>
            <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Integrated Trust & Privacy Banner */}
        <div className="w-full max-w-2xl p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-white block">100% Local Camera Processing</span>
              <span className="text-slate-400 text-[11px]">Video stream is analyzed inside your browser via WASM. Never uploaded or recorded.</span>
            </div>
          </div>
          <button
            onClick={onOpenPrivacy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/5 text-indigo-300 hover:text-white font-semibold text-[11px] whitespace-nowrap transition-colors"
          >
            Privacy Guarantees
          </button>
        </div>

        {/* Product UI Abstract Preview */}
        <div className="w-full max-w-3xl p-1 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/60 border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="p-4 rounded-xl bg-[#0d0f14] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">🟢 REAL-TIME EYE MONITORING ACTIVE</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> WebAssembly AI
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-purple-400" /> ~20 FPS Detection
              </span>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left w-full pt-4">
          
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-white text-base mb-1.5">Real-Time Monitoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browser-based landmark computer vision tracks eye state without sending video over the internet.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-white text-base mb-1.5">Smart Drowsiness Alerts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ignores normal blinks (under 700ms) and alerts only when eyes remain closed for 2+ seconds.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-white text-base mb-1.5">Privacy First</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero login required, zero video recordings saved, and client-side processing guaranteed.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <LineChart className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-white text-base mb-1.5">Study Session Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tracks study duration, awake monitoring stats, and session history stored locally.
            </p>
          </div>

        </div>

        {/* Key Product Highlights Checklist */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No sign-up or account required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Pomodoro & Free Study Modes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Customizable Alarm Sounds & Volume</span>
          </div>
        </div>

      </div>

      {/* Clean Minimalist Footer */}
      <footer className="relative w-full border-t border-slate-800/80 py-6 px-4 text-center z-10 bg-slate-950/40">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
          <span>Made with ❤️ by</span>
          <span className="font-bold text-white bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
            CIPERPY
          </span>
        </div>
      </footer>

    </div>
  );
}
