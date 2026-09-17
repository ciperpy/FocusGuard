import { useState, useRef, useCallback, useEffect } from 'react';

export function useCamera() {
  const [cameraState, setCameraState] = useState('idle'); // idle | requesting | active | denied | unsupported | error
  const [errorMessage, setErrorMessage] = useState('');
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.error('Error stopping track:', e);
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStream(null);
    setCameraState('idle');
  }, []);

  const startCamera = useCallback(async () => {
    // Check browser compatibility
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('unsupported');
      setErrorMessage('Your browser does not support webcam media access. Please use Chrome, Edge, Firefox, or Safari.');
      return false;
    }

    // Stop existing stream if any
    stopCamera();
    setCameraState('requesting');
    setErrorMessage('');

    try {
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'user'
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
        } catch (e) {
          console.warn('Video play warning during startCamera:', e);
        }
      }

      setCameraState('active');
      return true;
    } catch (err) {
      console.error('Webcam permission or access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setErrorMessage('Camera access was denied. Please allow camera permissions in your browser address bar and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraState('error');
        setErrorMessage('No camera device detected. Please connect a webcam and reload.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraState('error');
        setErrorMessage('Camera is currently in use by another application. Please close other video apps and retry.');
      } else {
        setCameraState('error');
        setErrorMessage(err.message || 'Unable to access camera.');
      }
      return false;
    }
  }, [stopCamera]);

  // Ensure videoRef gets srcObject whenever videoRef.current or stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn('Video auto-play effect error:', e));
      }
    }
  }, [stream, cameraState]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    cameraState,
    errorMessage,
    stream,
    startCamera,
    stopCamera
  };
}
