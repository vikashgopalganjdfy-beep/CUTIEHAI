/**
 * MediaPipe FaceMesh & Real-Time Smile Detection
 */

export interface FaceLandmark {
  x: number;
  y: number;
  z: number;
}

export interface SmileDetectionResult {
  hasFace: boolean;
  isSmiling: boolean;
  smileScore: number; // 0 to 100%
  landmarks?: FaceLandmark[];
  mouthOpenScore: number;
}

// MediaPipe global typings
declare global {
  interface Window {
    FaceMesh?: new (config?: { locateFile?: (file: string) => string }) => {
      setOptions: (options: {
        maxNumFaces: number;
        refineLandmarks: boolean;
        minDetectionConfidence: number;
        minTrackingConfidence: number;
      }) => void;
      onResults: (callback: (results: { multiFaceLandmarks?: FaceLandmark[][] }) => void) => void;
      send: (data: { image: HTMLVideoElement | HTMLCanvasElement }) => Promise<void>;
      close?: () => void;
    };
    Camera?: new (
      videoElement: HTMLVideoElement,
      config: {
        onFrame: () => Promise<void>;
        width?: number;
        height?: number;
      }
    ) => {
      start: () => Promise<void>;
      stop: () => void;
    };
  }
}

/**
 * Calculates smile metrics based on 3D geometric facial landmarks
 */
export function calculateSmileScore(landmarks: FaceLandmark[]): { smileScore: number; isSmiling: boolean; mouthOpen: number } {
  if (!landmarks || landmarks.length < 468) {
    return { smileScore: 0, isSmiling: false, mouthOpen: 0 };
  }

  // Landmark indices
  // Left and right corners of lips
  const p61 = landmarks[61];   // Left mouth corner
  const p291 = landmarks[291]; // Right mouth corner

  // Upper and lower lip centers
  const p13 = landmarks[13];   // Upper lip inner center
  const p14 = landmarks[14];   // Lower lip inner center

  // Outer cheek / face width landmarks
  const p234 = landmarks[234]; // Left cheek edge
  const p454 = landmarks[454]; // Right cheek edge

  // Nose tip
  const p1 = landmarks[1];

  // Distances
  const mouthWidth = Math.hypot(p291.x - p61.x, p291.y - p61.y);
  const faceWidth = Math.hypot(p454.x - p234.x, p454.y - p234.y) || 0.001;
  const mouthHeight = Math.hypot(p14.x - p13.x, p14.y - p13.y);

  // Normalised ratios
  const mouthWidthRatio = mouthWidth / faceWidth;
  const mouthHeightRatio = mouthHeight / faceWidth;

  // Lip corner elevation relative to center of lips
  const lipCenterY = (p13.y + p14.y) / 2;
  const cornersAvgY = (p61.y + p291.y) / 2;
  // In screen coords, Y goes downwards, so if corners are higher, cornersAvgY < lipCenterY
  const cornerLift = (lipCenterY - cornersAvgY) / faceWidth;

  // Cheeks elevation relative to nose tip
  const leftCheek = landmarks[205] || p61;
  const rightCheek = landmarks[425] || p291;
  const cheekLift = ((p1.y - leftCheek.y) + (p1.y - rightCheek.y)) / (2 * faceWidth);

  // Scoring weights:
  // Neutral mouthWidthRatio is ~0.40. Smiling can reach 0.50 - 0.65.
  // cornerLift is ~0.00 to -0.02 at rest, and +0.02 to +0.08 when smiling.
  const widthScore = Math.max(0, Math.min(100, ((mouthWidthRatio - 0.40) / 0.16) * 100));
  const liftScore = Math.max(0, Math.min(100, ((cornerLift + 0.01) / 0.06) * 100));
  const openScore = Math.max(0, Math.min(100, (mouthHeightRatio / 0.10) * 100));

  // Weighted composite score (50% corner lift + 35% mouth width + 15% cheek/opening)
  let rawScore = (liftScore * 0.52) + (widthScore * 0.36) + (openScore * 0.12);
  rawScore = Math.round(Math.max(0, Math.min(100, rawScore)));

  // A smile is considered detected when score >= 52
  const isSmiling = rawScore >= 50;

  return {
    smileScore: rawScore,
    isSmiling,
    mouthOpen: Math.round(openScore),
  };
}
