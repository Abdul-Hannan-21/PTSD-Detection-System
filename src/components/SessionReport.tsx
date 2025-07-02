import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface SessionReportProps {
  sessionId: Id<"sessions">;
  onBack: () => void;
}

export function SessionReport({ sessionId, onBack }: SessionReportProps) {
  const session = useQuery(api.sessions.getSession, { sessionId });
  const analysis = useQuery(api.analysis.getSessionAnalysis, { sessionId });

  if (!session || !analysis) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500"></div>
          <p className="text-secondary-600 font-medium">Loading report...</p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getRiskLevel = (score: number) => {
    if (score >= 0.7) return { 
      level: "High Risk", 
      color: "text-danger-700", 
      bgColor: "bg-danger-50",
      borderColor: "border-danger-200",
      icon: "⚠️"
    };
    if (score >= 0.4) return { 
      level: "Moderate Risk", 
      color: "text-warning-700", 
      bgColor: "bg-warning-50",
      borderColor: "border-warning-200",
      icon: "⚡"
    };
    return { 
      level: "Low Risk", 
      color: "text-success-700", 
      bgColor: "bg-success-50",
      borderColor: "border-success-200",
      icon: "✅"
    };
  };

  const riskLevel = getRiskLevel(analysis.overallScore);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Sessions</span>
          </div>
        </button>
        
        <button
          onClick={() => window.print()}
          className="btn-primary"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Report</span>
          </div>
        </button>
      </div>

      {/* Enhanced Report Content */}
      <div className="card p-10 space-y-10">
        {/* Header */}
        <div className="border-b border-secondary-200 pb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-strong">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-secondary-800 mb-2">
                PTSD Screening Report
              </h1>
              <p className="text-lg text-secondary-600">Advanced Eye-Tracking Analysis</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="space-y-1">
              <p className="font-semibold text-secondary-700">Participant</p>
              <p className="text-secondary-600">{session.participantName}</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-secondary-700">Date</p>
              <p className="text-secondary-600">{formatDate(session.startTime)}</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-secondary-700">Duration</p>
              <p className="text-secondary-600">
                {session.endTime 
                  ? `${Math.round((session.endTime - session.startTime) / 60000)} minutes`
                  : "In progress"
                }
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-secondary-700">Age</p>
              <p className="text-secondary-600">{session.participantAge || "Not specified"}</p>
            </div>
          </div>
        </div>

        {/* Enhanced Overall Assessment */}
        <div className={`card p-8 ${riskLevel.bgColor} border-2 ${riskLevel.borderColor}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-800">Overall Assessment</h2>
            <div className={`flex items-center space-x-3 px-4 py-2 rounded-container bg-white shadow-soft ${riskLevel.color}`}>
              <span className="text-2xl">{riskLevel.icon}</span>
              <span className="font-bold text-lg">{riskLevel.level}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="font-medium text-secondary-700">PTSD Risk Score</span>
              <span className="font-bold text-lg">{Math.round(analysis.overallScore * 100)}%</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-4 shadow-inner">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${
                  analysis.overallScore >= 0.7 ? "bg-gradient-to-r from-danger-400 to-danger-600" :
                  analysis.overallScore >= 0.4 ? "bg-gradient-to-r from-warning-400 to-warning-600" : 
                  "bg-gradient-to-r from-success-400 to-success-600"
                }`}
                style={{ width: `${analysis.overallScore * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Enhanced PTSD Markers */}
        <div>
          <h2 className="text-2xl font-bold text-secondary-800 mb-6">Detected Markers</h2>
          {analysis.ptsdMarkers.length > 0 ? (
            <div className="grid gap-6">
              {analysis.ptsdMarkers.map((marker, index) => (
                <div key={index} className="card p-6 border-l-4 border-l-primary-400">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg text-secondary-800">{marker.marker}</h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-secondary-600 bg-secondary-100 px-3 py-1 rounded-container">
                        Confidence: {Math.round(marker.confidence * 100)}%
                      </span>
                      <span className={`px-3 py-1 rounded-container text-sm font-medium ${
                        marker.severity >= 0.7 ? "bg-danger-100 text-danger-800" :
                        marker.severity >= 0.4 ? "bg-warning-100 text-warning-800" :
                        "bg-success-100 text-success-800"
                      }`}>
                        {marker.severity >= 0.7 ? "High" :
                         marker.severity >= 0.4 ? "Moderate" : "Low"} Severity
                      </span>
                    </div>
                  </div>
                  <p className="text-secondary-700 mb-4">{marker.description}</p>
                  <div className="w-full bg-secondary-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        marker.severity >= 0.7 ? "bg-gradient-to-r from-danger-400 to-danger-600" :
                        marker.severity >= 0.4 ? "bg-gradient-to-r from-warning-400 to-warning-600" : 
                        "bg-gradient-to-r from-success-400 to-success-600"
                      }`}
                      style={{ width: `${marker.severity * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 bg-success-50 border border-success-200 text-center">
              <div className="w-16 h-16 bg-success-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-success-800 mb-2">No Significant Markers Detected</h3>
              <p className="text-success-700">
                The eye-tracking analysis did not identify significant PTSD markers in this session.
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Recommendations */}
        <div>
          <h2 className="text-2xl font-bold text-secondary-800 mb-6">Clinical Recommendations</h2>
          <div className="card p-6 bg-primary-50 border border-primary-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <ul className="space-y-3">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-primary-500 font-bold text-lg">•</span>
                      <span className="text-primary-800 font-medium">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Technical Details */}
        <div className="border-t border-secondary-200 pt-8">
          <h2 className="text-2xl font-bold text-secondary-800 mb-6">Technical Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h3 className="font-bold text-lg text-secondary-800 mb-4">Calibration Data</h3>
              {session.calibrationData ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Baseline Pupil Size:</span>
                    <span className="font-medium">{session.calibrationData.baselinePupilSize.toFixed(2)}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Gaze Accuracy:</span>
                    <span className="font-medium">{Math.round(session.calibrationData.gazeAccuracy * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Calibration Points:</span>
                    <span className="font-medium">{session.calibrationData.calibrationPoints.length}</span>
                  </div>
                </div>
              ) : (
                <p className="text-secondary-500">No calibration data available</p>
              )}
            </div>
            
            <div className="card p-6">
              <h3 className="font-bold text-lg text-secondary-800 mb-4">Analysis Method</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Eye Tracking:</span>
                  <span className="font-medium">Computer Vision</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Pupillometry:</span>
                  <span className="font-medium">Real-time Analysis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Gaze Analysis:</span>
                  <span className="font-medium">Fixation & Saccade</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Stimuli Categories:</span>
                  <span className="font-medium">3 Types</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Disclaimer */}
        <div className="border-t border-secondary-200 pt-8">
          <div className="card p-6 bg-warning-50 border border-warning-200">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-warning-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-warning-800 mb-3">Important Clinical Disclaimer</h3>
                <p className="text-warning-700 text-sm leading-relaxed">
                  This report is generated by an automated eye-tracking analysis system and is intended 
                  as a screening tool only. It should not be used as a substitute for professional 
                  clinical assessment, diagnosis, or treatment. Any concerning results should be followed 
                  up with a qualified mental health professional for comprehensive evaluation. This tool 
                  is designed to assist healthcare providers and should be interpreted within the context 
                  of clinical judgment and additional assessment methods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
