import React from 'react';
import { Eye, ShieldAlert, AlertTriangle, Activity, SlidersHorizontal, Sparkles } from 'lucide-react';
import { DETECTION_STATES, SENSITIVITY_PRESETS } from '../utils/constants';

export function DetectionStatusCard({
  detectionState,
  currentEAR,
  baselineEAR,
  settings,
  drowsinessAlerts,
  alarmEvents,
  warningCountdownSec
}) {
  const earThreshold = baselineEAR !== null ? baselineEAR : (SENSITIVITY_PRESETS[settings?.sensitivityPreset]?.earThreshold || 0.20);
  const isEyeClosed = currentEAR < earThreshold;
  const sensitivityLabel = SENSITIVITY_PRESETS[settings?.sensitivityPreset]?.label || 'Medium Sensitivity';

  const getStatusMessage = () => {
    switch (detectionState) {
      case DETECTION_STATES.AWAKE:
        return {
          title: "You're doing great — stay focused.",
          color: "text-emerald-400"
        };
      case DETECTION_STATES.POSSIBLE_BLINK:
        return {
          title: "Normal blink detected.",
          color: "text-blue-400"
        };
      case DETECTION_STATES.WARNING:
        return {
          title: `Eyes closed — stay alert! Warning countdown: ${warningCountdownSec.toFixed(1)}s`,
          color: "text-amber-400"
        };
      case DETECTION_STATES.ALARM:
        return {
          title: "WAKE UP! Prolonged eye closure detected.",
          color: "text-red-400"
        };
      case DETECTION_STATES.FACE_NOT_DETECTED:
        return {
          title: "Face not detected. Please position face in view.",
          color: "text-slate-400"
        };
      case DETECTION_STATES.MULTIPLE_FACES:
        return {
          title: "Multiple faces detected in camera view.",
          color: "text-purple-400"
        };
      default:
        return {
          title: "Monitoring eye alertness in real-time.",
          color: "text-slate-300"
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="glass-panel p-5 rounded-2xl border border-[#242832] space-y-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-white text-sm">Detection State & Live Metrics</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-white/5">
          {sensitivityLabel}
        </span>
      </div>

      {/* Main Status Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {detectionState === DETECTION_STATES.ALARM ? (
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center animate-bounce">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
          ) : detectionState === DETECTION_STATES.WARNING ? (
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-emerald-400" />
            </div>
          )}
        </div>
        <div>
          <p className={`font-bold text-xs sm:text-sm ${statusInfo.color}`}>
            {statusInfo.title}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Blink tolerance ~{settings.blinkToleranceMs}ms | Warning ~{settings.warningDurationSec}s
          </p>
        </div>
      </div>

      {/* Live Eye Aspect Ratio Meter */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-300">Eye Openness Ratio (EAR)</span>
          <span className="font-mono text-indigo-300">
            {currentEAR.toFixed(3)} <span className="text-slate-500">(Threshold: {earThreshold.toFixed(2)})</span>
          </span>
        </div>
        <div className="relative w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
          {/* Threshold marker line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
            style={{ left: `${Math.min(100, Math.max(0, earThreshold * 200))}%` }}
          />
          {/* Fill bar */}
          <div
            className={`h-full transition-all duration-150 ${
              isEyeClosed ? 'bg-amber-500' : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, currentEAR * 200))}%` }}
          />
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Drowsiness Alerts</div>
          <div className="text-xl font-bold text-amber-300 font-mono mt-0.5">
            {drowsinessAlerts}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Alarm Triggers</div>
          <div className="text-xl font-bold text-red-400 font-mono mt-0.5">
            {alarmEvents}
          </div>
        </div>
      </div>

    </div>
  );
}
