import { DEFAULT_SETTINGS } from '../utils/constants';

const SETTINGS_KEY = 'focusguard_settings_v1';
const HISTORY_KEY = 'focusguard_history_v1';

export const storageService = {
  getSettings() {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Failed to read settings from localStorage', e);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  },

  getHistory() {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to read session history', e);
      return [];
    }
  },

  saveSession(sessionData) {
    try {
      const history = this.getHistory();
      const newSession = {
        id: 'session_' + Date.now(),
        startTime: sessionData.startTime || new Date().toISOString(),
        endTime: sessionData.endTime || new Date().toISOString(),
        durationSec: sessionData.durationSec || 0,
        awakeMonitoringSec: sessionData.awakeMonitoringSec || 0,
        drowsinessAlerts: sessionData.drowsinessAlerts || 0,
        alarmEvents: sessionData.alarmEvents || 0,
        mode: sessionData.mode || 'FREE_STUDY',
        sensitivity: sessionData.sensitivity || 'MEDIUM'
      };
      
      const updated = [newSession, ...history];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save session to history', e);
      return [];
    }
  },

  clearHistory() {
    try {
      localStorage.removeItem(HISTORY_KEY);
      return [];
    } catch (e) {
      console.error('Failed to clear session history', e);
      return [];
    }
  },

  deleteSession(sessionId) {
    try {
      const history = this.getHistory();
      const updated = history.filter(s => s.id !== sessionId);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to delete session', e);
      return this.getHistory();
    }
  }
};
