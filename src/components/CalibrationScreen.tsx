import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface CalibrationScreenProps {
  webcamRef: any;
  sessionId: Id<"sessions">;
  onComplete: (calibrationData: any) => void;
}

interface CalibrationPoint {
  x: number;
  y: number;
  id: number;
}

export function CalibrationScreen({ webcamRef, sessionId, onComplete }: CalibrationScreenProps) {
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [isCollecting, setIsCollecting] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState<CalibrationPoint[]>([]);
  const [collectedData, setCollectedData] = useState<any[]>([]);
  
  const recordEyeData = useMutation(api.sessions.recordEyeTrackingData);

  // Generate calibration points in a 3x3 grid
  useEffect(() => {
    const points: CalibrationPoint[] = [];
    let id = 0;
    
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        points.push({
          x: 20 + (col * 30), // 20%, 50%, 80% of screen width
          y: 20 + (row * 30), // 20%, 50%, 80% of screen height
          id: id++
        });
      }
    }
    
    setCalibrationPoints(points);
  }, []);

  useEffect(() => {
    if (currentPointIndex >= calibrationPoints.length) {
      // Calibration complete
      completeCalibration();
      return;
    }

    const timer = setTimeout(() => {
      setIsCollecting(true);
      
      // Collect data for 2 seconds
      const collectTimer = setTimeout(() => {
        setIsCollecting(false);
        setCurrentPointIndex(prev => prev + 1);
      }, 2000);

      return () => clearTimeout(collectTimer);
    }, 1000); // 1 second delay before collecting

    return () => clearTimeout(timer);
  }, [currentPointIndex, calibrationPoints.length]);

  // Simulate eye tracking data collection
  useEffect(() => {
    if (!isCollecting) return;

    const interval = setInterval(async () => {
      // Simulate eye tracking data (in a real implementation, this would come from actual eye tracking)
      const currentPoint = calibrationPoints[currentPointIndex];
      const simulatedData = {
        sessionId,
        timestamp: Date.now(),
        gazeX: currentPoint.x + (Math.random() - 0.5) * 5, // Add some noise
        gazeY: currentPoint.y + (Math.random() - 0.5) * 5,
        pupilDiameter: 3.5 + Math.random() * 0.5, // Simulate pupil size
        blinkDetected: Math.random() < 0.1, // 10% chance of blink
        fixationDuration: 200 + Math.random() * 100
      };

      try {
        await recordEyeData(simulatedData);
        setCollectedData(prev => [...prev, simulatedData]);
      } catch (error) {
        console.error("Error recording calibration data:", error);
      }
    }, 100); // Collect data every 100ms

    return () => clearInterval(interval);
  }, [isCollecting, currentPointIndex, calibrationPoints, sessionId, recordEyeData]);

  const completeCalibration = () => {
    // Calculate calibration metrics
    const avgPupilSize = collectedData.reduce((sum, d) => sum + d.pupilDiameter, 0) / collectedData.length;
    const gazeAccuracy = calculateGazeAccuracy();
    
    const calibrationData = {
      baselinePupilSize: avgPupilSize,
      gazeAccuracy,
      calibrationPoints: calibrationPoints.map(point => ({
        x: point.x,
        y: point.y,
        accuracy: 0.85 + Math.random() * 0.1 // Simulate accuracy between 85-95%
      }))
    };

    onComplete(calibrationData);
  };

  const calculateGazeAccuracy = () => {
    // Simplified accuracy calculation
    return 0.88 + Math.random() * 0.1; // Simulate 88-98% accuracy
  };

  if (currentPointIndex >= calibrationPoints.length) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Calibration Complete</h2>
        <p className="text-gray-600">Processing calibration data...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  const currentPoint = calibrationPoints[currentPointIndex];

  return (
    <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Eye Tracking Calibration</h2>
          <p className="text-gray-600">
            Look at the {isCollecting ? "red" : "blue"} dot and keep your head still
          </p>
          <p className="text-sm text-gray-500">
            Point {currentPointIndex + 1} of {calibrationPoints.length}
          </p>
        </div>
      </div>

      {/* Calibration point */}
      <div
        className={`absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          isCollecting ? "bg-red-500 scale-150" : "bg-blue-500"
        }`}
        style={{
          left: `${currentPoint.x}%`,
          top: `${currentPoint.y}%`
        }}
      >
        {isCollecting && (
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping"></div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {calibrationPoints.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index < currentPointIndex
                  ? "bg-green-500"
                  : index === currentPointIndex
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
