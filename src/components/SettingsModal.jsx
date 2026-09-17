import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Bell, Sliders, Coffee, Eye, X, Play, RotateCcw } from 'lucide-react';
import { SENSITIVITY_PRESETS, ALARM_SOUNDS, POMODORO_MODES } from '../utils/constants';
import { audioService } from '../services/audioService';

export function SettingsModal({ settings, onSaveSettings, onClose }) {
  const [formSettings, setFormSettings] = useState({ ...settings });
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const handleSensitivityPresetChange = (presetKey) => {
    if (presetKey === 'CUSTOM') {
      setFormSettings(prev => ({ ...prev, sensitivityPreset: 'CUSTOM' }));
      return;
    }

    const preset = SENSITIVITY_PRESETS[presetKey];
    if (preset) {
      setFormSettings(prev => ({
        ...prev,
        sensitivityPreset: presetKey,
        earThreshold: preset.earThreshold,
        warningDurationSec: preset.warningDurationSec,
        alarmDurationSec: preset.alarmDurationSec
      }));
    }
  };

  const handleTestSound = () => {
    setIsPlayingTest(true);
    audioService.setVolume(formSettings.alarmVolume);
    audioService.testSound(formSettings.alarmSound, 2000);
    setTimeout(() => {
      setIsPlayingTest(false);
    }, 2000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings(formSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="max-w-2xl w-full glass-panel p-6 sm:p-8 rounded-3xl border border-[#242832] space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Application Settings</h2>
              <p className="text-xs text-slate-400">Customize detection thresholds, alarm sounds, and study intervals.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* SECTION 1: Detection Sensitivity */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-white">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Detection Sensitivity</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.keys(SENSITIVITY_PRESETS).filter(k => k !== 'CUSTOM').map((presetKey) => {
                const preset = SENSITIVITY_PRESETS[presetKey];
                const isSelected = formSettings.sensitivityPreset === presetKey;
                return (
                  <button
                    key={presetKey}
                    type="button"
                    onClick={() => handleSensitivityPresetChange(presetKey)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{preset.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-tight">{preset.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Custom Timing Threshold Sliders */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="text-xs font-semibold text-slate-300">Timing & Eye Closure Thresholds</div>
            
            {/* Warning threshold slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Warning Threshold (Duration eyes closed before warning)</span>
                <span className="font-mono text-amber-400 font-bold">{formSettings.warningDurationSec}s</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={formSettings.warningDurationSec}
                onChange={(e) => setFormSettings(prev => ({
                  ...prev,
                  sensitivityPreset: 'CUSTOM',
                  warningDurationSec: parseFloat(e.target.value)
                }))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Alarm threshold slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Alarm Threshold (Duration eyes closed before sounding alarm)</span>
                <span className="font-mono text-red-400 font-bold">{formSettings.alarmDurationSec}s</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="6.0"
                step="0.1"
                value={formSettings.alarmDurationSec}
                onChange={(e) => setFormSettings(prev => ({
                  ...prev,
                  sensitivityPreset: 'CUSTOM',
                  alarmDurationSec: parseFloat(e.target.value)
                }))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Normal blink tolerance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Blink Tolerance (Normal blink duration filter)</span>
                <span className="font-mono text-indigo-300 font-bold">{formSettings.blinkToleranceMs}ms</span>
              </div>
              <input
                type="range"
                min="300"
                max="900"
                step="50"
                value={formSettings.blinkToleranceMs}
                onChange={(e) => setFormSettings(prev => ({ ...prev, blinkToleranceMs: parseInt(e.target.value) }))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* SECTION 3: Alarm Sound & Volume */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-white">
              <Bell className="w-4 h-4 text-indigo-400" />
              <span>Alarm Sound Options</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.keys(ALARM_SOUNDS).map((soundKey) => {
                const sound = ALARM_SOUNDS[soundKey];
                const isSelected = formSettings.alarmSound === soundKey;
                return (
                  <button
                    key={soundKey}
                    type="button"
                    onClick={() => setFormSettings(prev => ({ ...prev, alarmSound: soundKey }))}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{sound.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{sound.description}</div>
                  </button>
                );
              })}
            </div>

            {/* Volume & Test Controls */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto flex-1 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Alarm Volume</span>
                  <span className="font-mono text-indigo-300 font-bold">{formSettings.alarmVolume}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formSettings.alarmVolume}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, alarmVolume: parseInt(e.target.value) }))}
                    className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestSound}
                disabled={isPlayingTest}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current text-indigo-400" />
                <span>{isPlayingTest ? 'Playing Test Sound...' : 'Test Sound'}</span>
              </button>
            </div>
          </div>

          {/* SECTION 4: Study Mode (Free Study vs Pomodoro) */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-white">
              <Coffee className="w-4 h-4 text-purple-400" />
              <span>Study Session Mode</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {Object.keys(POMODORO_MODES).map((modeKey) => {
                const mode = POMODORO_MODES[modeKey];
                const isSelected = formSettings.pomodoroMode === modeKey;
                return (
                  <button
                    key={modeKey}
                    type="button"
                    onClick={() => setFormSettings(prev => ({ ...prev, pomodoroMode: modeKey }))}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{mode.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{mode.description}</div>
                  </button>
                );
              })}
            </div>

            {formSettings.pomodoroMode === 'POMODORO' && (
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Study (Min)</label>
                  <input
                    type="number"
                    min="5"
                    max="90"
                    value={formSettings.studyDurationMin}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, studyDurationMin: parseInt(e.target.value) || 25 }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Short Break (Min)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formSettings.shortBreakMin}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, shortBreakMin: parseInt(e.target.value) || 5 }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Long Break (Min)</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={formSettings.longBreakMin}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, longBreakMin: parseInt(e.target.value) || 15 }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: Landmarks Overlay Toggle */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-xs font-bold text-white">Landmarks Mesh Overlay</div>
                <div className="text-[10px] text-slate-400">Draw subtle eye contours on webcam preview.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formSettings.showLandmarksOverlay}
              onChange={(e) => setFormSettings(prev => ({ ...prev, showLandmarksOverlay: e.target.checked }))}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
