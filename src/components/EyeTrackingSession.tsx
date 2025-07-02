import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { WebcamCapture } from "./WebcamCapture";
import { StimulusPresentation } from "./StimulusPresentation";
import { CalibrationScreen } from "./CalibrationScreen";

interface EyeTrackingSessionProps {
  sessionId: Id<"sessions">;
  onComplete: () => void;
}

type SessionPhase = "setup" | "calibration" | "stimuli" | "analysis" | "complete";

export function EyeTrackingSession({ sessionId, onComplete }: EyeTrackingSessionProps) {
  const [currentPhase, setCurrentPhase] = useState<SessionPhase>("setup");
  const [isRecording, setIsRecording] = useState(false);
  const [calibrationData, setCalibrationData] = useState<any>(null);
  
  const session = useQuery(api.sessions.getSession, { sessionId });
  const stimuli = useQuery(api.stimuli.getActiveStimuli, {});
  const updateSessionStatus = useMutation(api.sessions.updateSessionStatus);
  const analyzeSession = useMutation(api.analysis.analyzeSession);
  
  const webcamRef = useRef<any>(null);

  const handleStartCalibration = () => {
    setCurrentPhase("calibration");
    setIsRecording(true);
  };

  const handleCalibrationComplete = async (data: any) => {
    setCalibrationData(data);
    
    try {
      await updateSessionStatus({
        sessionId,
        status: "active",
        calibrationData: data
      });
      
      setCurrentPhase("stimuli");
      toast.success("Calibration completed successfully");
    } catch (error) {
      console.error("Error updating calibration:", error);
      toast.error("Failed to save calibration data");
    }
  };

  const handleStimuliComplete = async () => {
    setIsRecording(false);
    setCurrentPhase("analysis");
    
    try {
      await updateSessionStatus({
        sessionId,
        status: "completed"
      });
      
      await analyzeSession({ sessionId });
      
      setCurrentPhase("complete");
      toast.success("Session completed and analyzed");
    } catch (error) {
      console.error("Error completing session:", error);
      toast.error("Failed to complete session analysis");
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500"></div>
          <p className="text-secondary-600 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  const getPhaseProgress = () => {
    switch (currentPhase) {
      case "setup": return 15;
      case "calibration": return 35;
      case "stimuli": return 70;
      case "analysis": return 90;
      case "complete": return 100;
      default: return 0;
    }
  };

  const getPhaseIcon = (phase: SessionPhase) => {
    const iconClasses = "w-6 h-6";
    switch (phase) {
      case "setup":
        return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>;
      case "calibration":
        return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>;
      case "stimuli":
        return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>;
      case "analysis":
        return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>;
      case "complete":
        return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Enhanced Progress Section */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-secondary-800">Session Progress</h2>
            <p className="text-secondary-600">Participant: {session.participantName}</p>
          </div>
          <div className="flex items-center space-x-2 text-primary-600">
            {getPhaseIcon(currentPhase)}
            <span className="font-semibold capitalize">{currentPhase}</span>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full bg-secondary-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getPhaseProgress()}%` }}
            />
          </div>
          <div className="absolute right-0 top-4 text-sm font-medium text-secondary-600">
            {getPhaseProgress()}% Complete
          </div>
        </div>
      </div>

      {/* Phase Content */}
      <div className="card p-8 min-h-[500px]">
        {currentPhase === "setup" && (
          <div className="text-center space-y-8 animate-slide-up">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto shadow-strong">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-secondary-800 mb-4">Session Setup</h2>
              <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
                We'll begin with precision eye-tracking calibration to establish your unique baseline patterns,
                followed by carefully designed stimulus presentation to detect PTSD markers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="card p-6 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-primary-900 mb-2">Calibration Phase</h3>
                <p className="text-sm text-primary-700">
                  Advanced 9-point calibration system to map your unique gaze patterns and establish 
                  baseline pupil measurements for accurate analysis.
                </p>
              </div>
              
              <div className="card p-6 bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200">
                <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-accent-900 mb-2">Stimulus Analysis</h3>
                <p className="text-sm text-accent-700">
                  Presentation of neutral, emotional, and trauma-related stimuli while monitoring 
                  pupil dilation, gaze patterns, and avoidance behaviors.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <WebcamCapture ref={webcamRef} />
              
              <button
                onClick={handleStartCalibration}
                className="btn-primary px-8 py-4 text-lg"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                  </svg>
                  <span>Begin Calibration</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {currentPhase === "calibration" && (
          <CalibrationScreen
            webcamRef={webcamRef}
            sessionId={sessionId}
            onComplete={handleCalibrationComplete}
          />
        )}

        {currentPhase === "stimuli" && stimuli && (
          <StimulusPresentation
            stimuli={stimuli}
            webcamRef={webcamRef}
            sessionId={sessionId}
            onComplete={handleStimuliComplete}
          />
        )}

        {currentPhase === "analysis" && (
          <div className="text-center space-y-8 animate-pulse-soft">
            <div className="w-20 h-20 bg-gradient-to-br from-warning-400 to-warning-500 rounded-2xl flex items-center justify-center mx-auto shadow-strong">
              <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-secondary-800 mb-4">Analyzing Results</h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Processing your eye-tracking data using advanced algorithms to identify PTSD markers 
                and generate comprehensive clinical insights...
              </p>
            </div>
            <div className="flex justify-center space-x-8 text-sm text-secondary-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <span>Pupil Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>Gaze Patterns</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span>PTSD Markers</span>
              </div>
            </div>
          </div>
        )}

        {currentPhase === "complete" && (
          <div className="text-center space-y-8 animate-slide-up">
            <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto shadow-strong">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-secondary-800 mb-4">Session Complete</h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Your comprehensive eye-tracking analysis has been completed successfully. 
                The detailed clinical report with PTSD markers and recommendations is now available.
              </p>
            </div>
            <button
              onClick={handleFinish}
              className="btn-primary px-8 py-4 text-lg"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>View Detailed Report</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
