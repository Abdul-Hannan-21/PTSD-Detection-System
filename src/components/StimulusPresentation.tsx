import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface Stimulus {
  _id: Id<"stimuli">;
  name: string;
  type: string;
  category: string;
  content: string;
  duration: number;
}

interface StimulusPresentationProps {
  stimuli: Stimulus[];
  webcamRef: any;
  sessionId: Id<"sessions">;
  onComplete: () => void;
}

export function StimulusPresentation({ stimuli, webcamRef, sessionId, onComplete }: StimulusPresentationProps) {
  const [currentStimulusIndex, setCurrentStimulusIndex] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [showFixation, setShowFixation] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  const recordEyeData = useMutation(api.sessions.recordEyeTrackingData);

  const currentStimulus = stimuli[currentStimulusIndex];

  useEffect(() => {
    if (currentStimulusIndex >= stimuli.length) {
      onComplete();
      return;
    }

    // Show fixation cross for 1 second
    setShowFixation(true);
    setIsPresenting(false);
    
    const fixationTimer = setTimeout(() => {
      setShowFixation(false);
      setIsPresenting(true);
      setTimeRemaining(currentStimulus.duration);
      
      // Start stimulus presentation timer
      const stimulusTimer = setTimeout(() => {
        setIsPresenting(false);
        setCurrentStimulusIndex(prev => prev + 1);
      }, currentStimulus.duration);

      return () => clearTimeout(stimulusTimer);
    }, 1000);

    return () => clearTimeout(fixationTimer);
  }, [currentStimulusIndex, stimuli.length, currentStimulus?.duration, onComplete]);

  // Countdown timer
  useEffect(() => {
    if (!isPresenting || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 100);
    }, 100);

    return () => clearInterval(timer);
  }, [isPresenting, timeRemaining]);

  // Enhanced eye tracking data collection during stimulus presentation
  useEffect(() => {
    if (!isPresenting) return;

    const interval = setInterval(async () => {
      // Enhanced simulation based on stimulus type and category
      const baseGazeX = 50 + (Math.random() - 0.5) * 8;
      const baseGazeY = 50 + (Math.random() - 0.5) * 8;
      
      // Enhanced response patterns based on stimulus category
      let pupilDiameter = 3.5;
      let gazeVariability = 4;
      let blinkProbability = 0.08;
      let fixationDuration = 250;
      let saccadeVelocity = 200;
      
      if (currentStimulus.category === "emotional") {
        pupilDiameter += 0.4 + Math.random() * 0.3; // Increased pupil dilation
        gazeVariability += 2; // More gaze variability
        blinkProbability = 0.12; // Increased blink rate
        fixationDuration = 180 + Math.random() * 80; // Shorter fixations
        saccadeVelocity = 280 + Math.random() * 60; // Faster saccades
      } else if (currentStimulus.category === "trauma-related") {
        pupilDiameter += 0.6 + Math.random() * 0.4; // Highest pupil dilation
        gazeVariability += 4; // Highest gaze variability (avoidance)
        blinkProbability = 0.15; // Highest blink rate
        fixationDuration = 120 + Math.random() * 60; // Shortest fixations (avoidance)
        saccadeVelocity = 350 + Math.random() * 100; // Fastest saccades (hypervigilance)
      } else {
        // Neutral stimuli - baseline responses
        fixationDuration = 220 + Math.random() * 80;
        saccadeVelocity = 180 + Math.random() * 40;
      }

      const simulatedData = {
        sessionId,
        timestamp: Date.now(),
        stimulusId: currentStimulus._id,
        gazeX: baseGazeX + (Math.random() - 0.5) * gazeVariability,
        gazeY: baseGazeY + (Math.random() - 0.5) * gazeVariability,
        pupilDiameter: pupilDiameter + (Math.random() - 0.5) * 0.2,
        blinkDetected: Math.random() < blinkProbability,
        fixationDuration,
        saccadeVelocity
      };

      try {
        await recordEyeData(simulatedData);
      } catch (error) {
        console.error("Error recording stimulus data:", error);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPresenting, currentStimulus, sessionId, recordEyeData]);

  if (currentStimulusIndex >= stimuli.length) {
    return (
      <div className="text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto shadow-strong">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-secondary-800">Stimulus Presentation Complete</h2>
        <p className="text-secondary-600">All stimuli have been presented. Analyzing eye-tracking patterns...</p>
      </div>
    );
  }

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "neutral":
        return {
          textColor: "text-secondary-700",
          bgColor: "bg-secondary-50",
          borderColor: "border-secondary-200"
        };
      case "emotional":
        return {
          textColor: "text-warning-700",
          bgColor: "bg-warning-50",
          borderColor: "border-warning-300"
        };
      case "trauma-related":
        return {
          textColor: "text-danger-700",
          bgColor: "bg-danger-50",
          borderColor: "border-danger-300"
        };
      default:
        return {
          textColor: "text-secondary-700",
          bgColor: "bg-secondary-50",
          borderColor: "border-secondary-200"
        };
    }
  };

  const categoryStyles = getCategoryStyles(currentStimulus?.category);

  return (
    <div className="relative min-h-[500px] card border-2 overflow-hidden">
      {/* Enhanced Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-secondary-200">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-100"
          style={{
            width: `${((currentStimulusIndex + (isPresenting ? (currentStimulus.duration - timeRemaining) / currentStimulus.duration : 0)) / stimuli.length) * 100}%`
          }}
        />
      </div>

      {/* Content area */}
      <div className="absolute inset-0 flex items-center justify-center pt-8">
        {showFixation && (
          <div className="text-6xl font-bold text-secondary-400 animate-pulse">+</div>
        )}

        {isPresenting && (
          <div className="text-center space-y-6 animate-fade-in">
            {currentStimulus.type === "word" && (
              <div className={`text-7xl font-bold ${categoryStyles.textColor} transition-all duration-300`}>
                {currentStimulus.content}
              </div>
            )}
            
            {currentStimulus.type === "face" && (
              <div className="space-y-4">
                <div className="w-40 h-40 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-full mx-auto flex items-center justify-center shadow-medium">
                  <span className="text-secondary-600 text-sm text-center px-6 font-medium">
                    {currentStimulus.content}
                  </span>
                </div>
              </div>
            )}
            
            {currentStimulus.type === "image" && (
              <div className="w-80 h-60 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-xl mx-auto flex items-center justify-center shadow-medium">
                <span className="text-secondary-600 text-center px-6 font-medium">
                  {currentStimulus.content}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Status info */}
      <div className="absolute bottom-6 left-6 flex items-center space-x-4">
        <div className="text-sm text-secondary-600 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-container">
          Stimulus {currentStimulusIndex + 1} of {stimuli.length}
        </div>
        
        <div className={`px-3 py-2 rounded-container text-xs font-medium ${categoryStyles.bgColor} ${categoryStyles.textColor} ${categoryStyles.borderColor} border`}>
          {currentStimulus?.category?.replace('-', ' ').toUpperCase()}
        </div>
      </div>

      <div className="absolute bottom-6 right-6">
        {isPresenting && (
          <div className="text-sm text-secondary-600 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-container">
            {Math.ceil(timeRemaining / 1000)}s remaining
          </div>
        )}
      </div>

      {/* Eye tracking indicator */}
      <div className="absolute top-6 left-6">
        <div className="flex items-center space-x-2 bg-danger-500 text-white px-3 py-2 rounded-container text-xs font-medium">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>TRACKING</span>
        </div>
      </div>
    </div>
  );
}
