import { Id } from "../../convex/_generated/dataModel";

interface Session {
  _id: Id<"sessions">;
  participantName: string;
  participantAge?: number;
  sessionType: string;
  status: string;
  startTime: number;
  endTime?: number;
  analysisResults?: {
    overallScore: number;
    ptsdMarkers: Array<{
      marker: string;
      severity: number;
      confidence: number;
      description: string;
    }>;
  };
}

interface SessionListProps {
  sessions: Session[];
  onStartSession: (sessionId: Id<"sessions">) => void;
  onViewReport: (sessionId: Id<"sessions">) => void;
}

export function SessionList({ sessions, onStartSession, onViewReport }: SessionListProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "status-badge";
    switch (status) {
      case "completed":
        return `${baseClasses} bg-success-100 text-success-800 border border-success-200`;
      case "active":
        return `${baseClasses} bg-primary-100 text-primary-800 border border-primary-200`;
      case "cancelled":
        return `${baseClasses} bg-danger-100 text-danger-800 border border-danger-200`;
      default:
        return `${baseClasses} bg-secondary-100 text-secondary-800 border border-secondary-200`;
    }
  };

  const getRiskIndicator = (score?: number) => {
    if (!score) return { level: "Pending", color: "text-secondary-500", bgColor: "bg-secondary-50", icon: "⏳" };
    if (score >= 0.7) return { level: "High Risk", color: "text-danger-700", bgColor: "bg-danger-50", icon: "⚠️" };
    if (score >= 0.4) return { level: "Moderate", color: "text-warning-700", bgColor: "bg-warning-50", icon: "⚡" };
    return { level: "Low Risk", color: "text-success-700", bgColor: "bg-success-50", icon: "✅" };
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-24 h-24 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-secondary-800 mb-3">No Sessions Yet</h3>
        <p className="text-secondary-600 mb-6 max-w-md mx-auto">
          Start your first PTSD screening session to begin analyzing eye-tracking patterns and detecting potential markers.
        </p>
        <div className="inline-flex items-center space-x-2 text-primary-600 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Click "New Session" to get started</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-secondary-800">Session History</h2>
          <p className="text-secondary-600 mt-1">Track and analyze PTSD screening sessions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-secondary-600">
            <span className="font-medium">{sessions.length}</span> total sessions
          </div>
        </div>
      </div>
      
      <div className="grid gap-4">
        {sessions.map((session, index) => {
          const riskLevel = getRiskIndicator(session.analysisResults?.overallScore);
          
          return (
            <div 
              key={session._id} 
              className="card p-6 hover:shadow-strong transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-800">
                        {session.participantName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-secondary-600">
                        <span>{formatDate(session.startTime)}</span>
                        {session.participantAge && (
                          <span>Age: {session.participantAge}</span>
                        )}
                        <span className="capitalize">{session.sessionType}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={getStatusBadge(session.status)}>
                      {session.status}
                    </span>
                    
                    <div className={`risk-indicator ${riskLevel.bgColor} ${riskLevel.color}`}>
                      <span className="text-lg">{riskLevel.icon}</span>
                      <span>{riskLevel.level}</span>
                    </div>
                    
                    {session.analysisResults && (
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              session.analysisResults.overallScore >= 0.7 ? "bg-danger-500" :
                              session.analysisResults.overallScore >= 0.4 ? "bg-warning-500" : "bg-success-500"
                            }`}
                            style={{ width: `${session.analysisResults.overallScore * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-secondary-700">
                          {Math.round(session.analysisResults.overallScore * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {session.status === "active" && (
                    <button
                      onClick={() => onStartSession(session._id)}
                      className="btn-primary"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                        </svg>
                        <span>Continue</span>
                      </div>
                    </button>
                  )}
                  {session.status === "completed" && (
                    <button
                      onClick={() => onViewReport(session._id)}
                      className="btn-secondary"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>View Report</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
