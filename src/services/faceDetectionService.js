import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let faceLandmarkerInstance = null;
let isInitializing = false;

/**
 * Initializes MediaPipe FaceLandmarker with GPU delegate and CPU fallback
 */
export async function initFaceLandmarker() {
  if (faceLandmarkerInstance) return faceLandmarkerInstance;
  if (isInitializing) {
    // Wait for in-progress initialization
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (faceLandmarkerInstance) return faceLandmarkerInstance;
  }

  isInitializing = true;
  try {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm'
    );

    try {
      // Try GPU Delegate first
      faceLandmarkerInstance = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: 'GPU'
        },
        outputFaceBlendshapes: true,
        runningMode: 'VIDEO',
        numFaces: 3
      });
    } catch (gpuError) {
      console.warn('GPU delegate failed for MediaPipe FaceLandmarker, falling back to CPU:', gpuError);
      faceLandmarkerInstance = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: 'CPU'
        },
        outputFaceBlendshapes: true,
        runningMode: 'VIDEO',
        numFaces: 3
      });
    }

    return faceLandmarkerInstance;
  } catch (error) {
    console.error('Failed to initialize MediaPipe FaceLandmarker:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

/**
 * Runs detection on video element frame
 */
export function detectFaceLandmarks(videoElement, timestampMs) {
  if (!faceLandmarkerInstance || !videoElement || videoElement.readyState < 2) {
    return null;
  }

  try {
    return faceLandmarkerInstance.detectForVideo(videoElement, timestampMs);
  } catch (err) {
    console.error('Error during detectForVideo:', err);
    return null;
  }
}

/**
 * Draws sleek eye contours and face bounding box overlay on canvas
 */
export function drawEyeMeshOverlay(canvasCtx, landmarks, width, height, state) {
  if (!canvasCtx || !landmarks || landmarks.length === 0) {
    if (canvasCtx) canvasCtx.clearRect(0, 0, width, height);
    return;
  }

  canvasCtx.clearRect(0, 0, width, height);

  // Determine stroke color based on state
  let strokeColor = 'rgba(99, 102, 241, 0.7)'; // Default Indigo
  let fillColor = 'rgba(99, 102, 241, 0.15)';

  if (state === 'WARNING') {
    strokeColor = 'rgba(234, 179, 8, 0.9)'; // Amber / Yellow
    fillColor = 'rgba(234, 179, 8, 0.25)';
  } else if (state === 'ALARM') {
    strokeColor = 'rgba(239, 68, 68, 1.0)'; // Red
    fillColor = 'rgba(239, 68, 68, 0.4)';
  } else if (state === 'POSSIBLE_BLINK') {
    strokeColor = 'rgba(59, 130, 246, 0.8)'; // Blue
    fillColor = 'rgba(59, 130, 246, 0.2)';
  }

  const leftEyeIndices = [33, 160, 158, 133, 153, 144];
  const rightEyeIndices = [362, 385, 387, 263, 380, 373];

  const drawEyePath = (indices) => {
    canvasCtx.beginPath();
    indices.forEach((idx, i) => {
      const pt = landmarks[idx];
      if (!pt) return;
      const x = pt.x * width;
      const y = pt.y * height;
      if (i === 0) canvasCtx.moveTo(x, y);
      else canvasCtx.lineTo(x, y);
    });
    canvasCtx.closePath();
    canvasCtx.strokeStyle = strokeColor;
    canvasCtx.lineWidth = 2;
    canvasCtx.fillStyle = fillColor;
    canvasCtx.fill();
    canvasCtx.stroke();
  };

  // Draw eye paths
  drawEyePath(leftEyeIndices);
  drawEyePath(rightEyeIndices);

  // Draw subtle iris dots (468: Left Iris center, 473: Right Iris center)
  if (landmarks[468] && landmarks[473] && state === 'AWAKE') {
    const drawIrisDot = (idx) => {
      const pt = landmarks[idx];
      canvasCtx.beginPath();
      canvasCtx.arc(pt.x * width, pt.y * height, 3, 0, 2 * Math.PI);
      canvasCtx.fillStyle = 'rgba(52, 211, 153, 0.9)'; // Emerald Green dot
      canvasCtx.fill();
    };
    drawIrisDot(468);
    drawIrisDot(473);
  }
}
