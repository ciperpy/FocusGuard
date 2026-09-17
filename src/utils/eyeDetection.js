/**
 * Utility functions for calculating Eye Aspect Ratio (EAR) and facial analysis
 * using MediaPipe FaceLandmarker points in 2D image coordinate space.
 */

// Landmark indices for MediaPipe 468/478 Face Mesh
// Left eye
const LEFT_EYE_CORNER_OUTER = 33;
const LEFT_EYE_CORNER_INNER = 133;
const LEFT_EYE_TOP_1 = 160;
const LEFT_EYE_BOTTOM_1 = 144;
const LEFT_EYE_TOP_2 = 158;
const LEFT_EYE_BOTTOM_2 = 153;

// Right eye
const RIGHT_EYE_CORNER_INNER = 362;
const RIGHT_EYE_CORNER_OUTER = 263;
const RIGHT_EYE_TOP_1 = 385;
const RIGHT_EYE_BOTTOM_1 = 373;
const RIGHT_EYE_TOP_2 = 387;
const RIGHT_EYE_BOTTOM_2 = 380;

/**
 * Calculates 2D Euclidean distance between two landmark points
 * (Using 2D x,y coordinates avoids 3D Z-depth noise which prevents EAR from dropping on eye closure)
 */
function distance2D(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates Eye Aspect Ratio (EAR) for a single eye given landmark list
 */
function calculateSingleEyeEAR(landmarks, outerIdx, innerIdx, top1Idx, bottom1Idx, top2Idx, bottom2Idx) {
  if (!landmarks || landmarks.length < 400) return 0;

  const pOuter = landmarks[outerIdx];
  const pInner = landmarks[innerIdx];
  const pTop1 = landmarks[top1Idx];
  const pBottom1 = landmarks[bottom1Idx];
  const pTop2 = landmarks[top2Idx];
  const pBottom2 = landmarks[bottom2Idx];

  if (!pOuter || !pInner || !pTop1 || !pBottom1 || !pTop2 || !pBottom2) return 0;

  const distV1 = distance2D(pTop1, pBottom1);
  const distV2 = distance2D(pTop2, pBottom2);
  const distH = distance2D(pOuter, pInner);

  if (distH === 0) return 0;

  return (distV1 + distV2) / (2.0 * distH);
}

/**
 * Calculates average Eye Aspect Ratio (EAR) across both eyes
 */
export function calculateAverageEAR(landmarks) {
  if (!landmarks || landmarks.length < 400) return 0;

  const leftEAR = calculateSingleEyeEAR(
    landmarks,
    LEFT_EYE_CORNER_OUTER,
    LEFT_EYE_CORNER_INNER,
    LEFT_EYE_TOP_1,
    LEFT_EYE_BOTTOM_1,
    LEFT_EYE_TOP_2,
    LEFT_EYE_BOTTOM_2
  );

  const rightEAR = calculateSingleEyeEAR(
    landmarks,
    RIGHT_EYE_CORNER_INNER,
    RIGHT_EYE_CORNER_OUTER,
    RIGHT_EYE_TOP_1,
    RIGHT_EYE_BOTTOM_1,
    RIGHT_EYE_TOP_2,
    RIGHT_EYE_BOTTOM_2
  );

  return (leftEAR + rightEAR) / 2.0;
}

/**
 * Extracts MediaPipe Face Landmarker Blendshape blink scores (if available)
 * Returns { leftBlinkScore, rightBlinkScore, avgBlinkScore }
 */
export function extractBlinkBlendshapes(blendshapes) {
  let leftBlinkScore = 0;
  let rightBlinkScore = 0;

  if (blendshapes && blendshapes.categories) {
    for (const category of blendshapes.categories) {
      const name = category.categoryName;
      if (name === 'eyeBlinkLeft' || name === 'eyeBlink_L' || name === 'blinkLeft') {
        leftBlinkScore = category.score;
      } else if (name === 'eyeBlinkRight' || name === 'eyeBlink_R' || name === 'blinkRight') {
        rightBlinkScore = category.score;
      }
    }
  }

  return {
    leftBlinkScore,
    rightBlinkScore,
    avgBlinkScore: (leftBlinkScore + rightBlinkScore) / 2.0
  };
}

/**
 * Estimates overall brightness of a canvas image frame (0 to 255)
 */
export function calculateFrameBrightness(canvas, ctx) {
  if (!canvas || !ctx || canvas.width === 0 || canvas.height === 0) return 255;
  try {
    const w = 50;
    const h = 50;
    const sx = Math.max(0, Math.floor((canvas.width - w) / 2));
    const sy = Math.max(0, Math.floor((canvas.height - h) / 2));
    const imageData = ctx.getImageData(sx, sy, w, h);
    const data = imageData.data;
    let sum = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    
    return sum / (data.length / 4);
  } catch (err) {
    return 255;
  }
}
