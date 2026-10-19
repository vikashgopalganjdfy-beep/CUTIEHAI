import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RefreshCw, AlertCircle, Sparkles, Smile, Maximize2, Minimize2 } from 'lucide-react';
import { calculateSmileScore, FaceLandmark } from '../utils/faceDetection';

interface CameraMirrorProps {
  onSmileUpdate: (score: number, isSmiling: boolean) => void;
  smileScore: number;
  isSmiling: boolean;
  isCameraActive: boolean;
  onActivateCamera: () => void;
}

export const CameraMirror: React.FC<CameraMirrorProps> = ({
  onSmileUpdate,
  smileScore,
  isSmiling,
  isCameraActive,
  onActivateCamera,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const faceMeshRef = useRef<unknown>(null);

  const [hasPermissionError, setHasPermissionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isExpanded, setIsExpanded] = useState(false);

  // Initialize MediaPipe FaceMesh
  const initFaceMesh = useCallback(() => {
    if (typeof window.FaceMesh !== 'undefined' && !faceMeshRef.current) {
      try {
        const fm = new window.FaceMesh({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        fm.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        fm.onResults((results: { multiFaceLandmarks?: FaceLandmark[][] }) => {
          if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            const { smileScore, isSmiling } = calculateSmileScore(landmarks);
            onSmileUpdate(smileScore, isSmiling);
          } else {
            onSmileUpdate(0, false);
          }
        });

        faceMeshRef.current = fm;
      } catch (err) {
        console.warn('FaceMesh initialization note:', err);
      }
    }
  }, [onSmileUpdate]);

  // Start video stream
  const startCamera = useCallback(async () => {
    setIsLoadingCamera(true);
    setHasPermissionError(false);
    setErrorMessage('');

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsLoadingCamera(false);
      initFaceMesh();
    } catch (err: unknown) {
      setIsLoadingCamera(false);
      setHasPermissionError(true);
      const errObj = err as Error;
      if (errObj.name === 'NotAllowedError' || errObj.name === 'PermissionDeniedError') {
        setErrorMessage('कैमरा अनुमति नहीं मिली। आप नीचे दिए गए बटनों से भी खेल सकते हैं!');
      } else {
        setErrorMessage('कैमरा शुरू नहीं हो पाया। आप नीचे दिए गए बटनों से खेल सकते हैं!');
      }
    }
  }, [facingMode, initFaceMesh]);

  // Frame processing loop for FaceMesh
  useEffect(() => {
    let active = true;

    const processFrame = async () => {
      if (
        active &&
        videoRef.current &&
        videoRef.current.readyState >= 2 &&
        faceMeshRef.current
      ) {
        try {
          const fm = faceMeshRef.current as { send: (data: { image: HTMLVideoElement }) => Promise<void> };
          await fm.send({ image: videoRef.current });
        } catch {
          // Process frame error ignored
        }
      }
      if (active) {
        animFrameRef.current = requestAnimationFrame(processFrame);
      }
    };

    if (isCameraActive && !hasPermissionError) {
      animFrameRef.current = requestAnimationFrame(processFrame);
    }

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isCameraActive, hasPermissionError]);

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive, facingMode, startCamera]);

  const toggleCameraFacing = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden transition-all duration-300 shadow-xl border-4 ${
        isSmiling ? 'border-pink-500 shadow-pink-300/60' : 'border-amber-400 shadow-amber-200/50'
      } bg-slate-900 text-white ${
        isExpanded
          ? 'fixed inset-4 z-50 flex flex-col items-center justify-center max-w-lg mx-auto bg-black/95'
          : 'w-36 sm:w-44 h-36 sm:h-44'
      }`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`w-full h-full object-cover transform ${facingMode === 'user' ? '-scale-x-100' : ''}`}
      />

      {/* Loading state indicator */}
      {isLoadingCamera && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 p-2 text-center">
          <RefreshCw className="w-8 h-8 text-amber-300 animate-spin mb-1" />
          <p className="text-xs font-bold text-amber-200">कैमरा शुरू हो रहा है...</p>
        </div>
      )}

      {/* Permission Error Overlay */}
      {hasPermissionError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-900/90 p-3 text-center z-10">
          <AlertCircle className="w-6 h-6 text-rose-300 mb-1" />
          <p className="text-[11px] font-bold text-rose-100 leading-tight mb-2">
            {errorMessage}
          </p>
          <button
            onClick={startCamera}
            className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-full shadow"
          >
            फिर कोशिश करें
          </button>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-auto">
        <button
          onClick={toggleCameraFacing}
          title="कैमरा बदलें"
          className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm active:scale-90 transition-transform"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'छोटा करें' : 'बड़ा करें'}
          className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm active:scale-90 transition-transform"
        >
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Live Smile Meter Bar on bottom of Mirror */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-1.5 flex flex-col gap-0.5">
        <div className="flex items-center justify-between text-[11px] font-black px-1">
          <span className="flex items-center gap-1">
            {isSmiling ? (
              <span className="text-pink-400 flex items-center gap-0.5 animate-pulse">
                <Sparkles className="w-3 h-3" /> वाह! मुस्कान!
              </span>
            ) : (
              <span className="text-amber-200 flex items-center gap-0.5">
                <Smile className="w-3 h-3" /> मुस्कान:
              </span>
            )}
          </span>
          <span className={isSmiling ? 'text-pink-300 font-black' : 'text-amber-300 font-black'}>
            {smileScore}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-150 ${
              isSmiling
                ? 'bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 animate-pulse'
                : 'bg-amber-400'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, smileScore))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
