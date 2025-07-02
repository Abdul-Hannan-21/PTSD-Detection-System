import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface WebcamCaptureProps {
  onFrame?: (imageData: ImageData) => void;
}

export const WebcamCapture = forwardRef<any, WebcamCaptureProps>(({ onFrame }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useImperativeHandle(ref, () => ({
    getVideoElement: () => videoRef.current,
    getCanvas: () => canvasRef.current,
    captureFrame: () => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          return ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
      }
      return null;
    }
  }));

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          }
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startWebcam();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!onFrame) return;

    const captureFrames = () => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx && video.readyState === 4) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          onFrame(imageData);
        }
      }
      
      requestAnimationFrame(captureFrames);
    };

    const intervalId = setInterval(captureFrames, 33); // ~30 FPS

    return () => clearInterval(intervalId);
  }, [onFrame]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full max-w-md mx-auto rounded-lg shadow-lg"
      />
      <canvas
        ref={canvasRef}
        className="hidden"
      />
      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
        RECORDING
      </div>
    </div>
  );
});

WebcamCapture.displayName = "WebcamCapture";
