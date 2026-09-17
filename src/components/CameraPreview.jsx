import React, { useEffect, useRef } from 'react';
import { Camera, CameraOff, AlertTriangle, Users, SunMedium, RefreshCw, ShieldAlert } from 'lucide-react';
import { DETECTION_STATES } from '../utils/constants';

export function CameraPreview({
  videoRef,
  stream,
  cameraState,
  errorMessage,
  onRetryCamera,
  detectionState,
  warningCountdownSec,
  isLowLight,
  faceCount,
  onFrame,
  isCalibrating
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Guarantee video element srcObject is attached and playing
  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl && stream) {
      if (videoEl.srcObject !== stream) {
        videoEl.srcObject = stream;
      }
      videoEl.play().catch(err => {
        console.warn('Video element play warning:', err);
      });
    }
  }, [videoRef, stream, cameraState]);

  // Frame processing loop connecting video to MediaPipe face detector
  useEffect(() => {
    const loop = (timestamp) => {
      if (videoRef.current && canvasRef.current && onFrame) {
        onFrame(videoRef.current, canvasRef.current, timestamp);
      }
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onFrame, videoRef]);

  // Helper to render live status pill badge
  const renderStatusBadge = () => {
    if (isCalibrating) {
      return (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold animate-pulse shadow-lg">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Calibrating Baseline...</span>
        </div>
      );
    }

    switch (detectionState) {
      case DETECTION_STATES.AWAKE:
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-lg shadow-emerald-500/10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>🟢 Awake</span>
          </div>
        );
      case DETECTION_STATES.POSSIBLE_BLINK:
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span>🔵 Blink</span>
          </div>
        );
      case DETECTION_STATES.WARNING:
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-bounce shadow-lg shadow-amber-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>🟡 Eyes Closed ({warningCountdownSec.toFixed(1)}s)</span>
          </div>
        );
      case DETECTION_STATES.ALARM:
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 border border-red-400 text-white text-xs font-extrabold animate-pulse shadow-lg shadow-red-600/50">
            <ShieldAlert className="w-4 h-4" />
            <span>🔴 WAKE UP!</span>
          </div>
        );
      case DETECTION_STATES.FACE_NOT_DETECTED:
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 text-xs font-semibold shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>⚪ Face Not Detected</span>
          </div>
        );
      case DETECTION_STATES.MULTIPLE_FACES:
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold shadow-lg">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>👥 Multiple Faces ({faceCount})</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full aspect-video sm:aspect-[4/3] lg:aspect-video rounded-2xl bg-[#111318] border border-[#242832] overflow-hidden shadow-2xl flex flex-col items-center justify-center group">
      
      {/* 1. Camera Active View */}
      {cameraState === 'active' && (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {/* Main Video Stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />

          {/* Eye Contour Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 pointer-events-none"
          />

          {/* Top Left Live Status Badge */}
          <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
            {renderStatusBadge()}

            {/* Low light pill */}
            {isLowLight && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium backdrop-blur-md">
                <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                <span>Low Light</span>
              </div>
            )}
          </div>

          {/* Top Right Privacy Indicator */}
          <div className="absolute top-3 right-3 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-slate-300 text-[11px] font-medium backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Local Camera Feed</span>
          </div>

          {/* Bottom Guidance Message Overlay */}
          {detectionState === DETECTION_STATES.FACE_NOT_DETECTED && (
            <div className="absolute bottom-4 inset-x-4 z-20 max-w-sm mx-auto p-3 rounded-xl glass-panel text-center border border-slate-700/80 shadow-xl animate-fade-in">
              <p className="text-xs font-semibold text-slate-200">
                Please position your face inside the camera frame.
              </p>
            </div>
          )}

          {detectionState === DETECTION_STATES.MULTIPLE_FACES && (
            <div className="absolute bottom-4 inset-x-4 z-20 max-w-sm mx-auto p-3 rounded-xl glass-panel text-center border border-purple-500/40 shadow-xl">
              <p className="text-xs font-semibold text-purple-200">
                Multiple faces detected. Please ensure only the student is visible.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. Camera Permission Requesting */}
      {cameraState === 'requesting' && (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center animate-pulse">
            <Camera className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Accessing Webcam...</h4>
            <p className="text-xs text-slate-400 mt-1">Please allow camera permissions when prompted by your browser.</p>
          </div>
        </div>
      )}

      {/* 3. Camera Permission Denied */}
      {cameraState === 'denied' && (
        <div className="flex flex-col items-center justify-center p-6 text-center max-w-md space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <CameraOff className="w-7 h-7 text-red-400" />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base">Camera Access Required</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Camera access is required for real-time eye monitoring. Please click the camera icon in your browser address bar to enable access and try again.
            </p>
          </div>
          <button
            onClick={onRetryCamera}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* 4. Camera Error / Unsupported */}
      {(cameraState === 'error' || cameraState === 'unsupported') && (
        <div className="flex flex-col items-center justify-center p-6 text-center max-w-md space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base">Camera Unavailable</h4>
            <p className="text-xs text-slate-400">{errorMessage || 'Unable to connect to camera.'}</p>
          </div>
          <button
            onClick={onRetryCamera}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Camera</span>
          </button>
        </div>
      )}

    </div>
  );
}
