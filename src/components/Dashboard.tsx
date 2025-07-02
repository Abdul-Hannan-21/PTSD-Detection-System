import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SessionList } from "./SessionList";
import { NewSessionForm } from "./NewSessionForm";
import { EyeTrackingSession } from "./EyeTrackingSession";
import { SessionReport } from "./SessionReport";
import { Id } from "../../convex/_generated/dataModel";

export function Dashboard() {
  const [activeView, setActiveView] = useState<"sessions" | "new-session" | "tracking" | "report">("sessions");
  const [selectedSessionId, setSelectedSessionId] = useState<Id<"sessions"> | null>(null);
  
  const sessions = useQuery(api.sessions.getUserSessions);

  const handleStartSession = (sessionId: Id<"sessions">) => {
    setSelectedSessionId(sessionId);
    setActiveView("tracking");
  };

  const handleViewReport = (sessionId: Id<"sessions">) => {
    setSelectedSessionId(sessionId);
    setActiveView("report");
  };

  const handleSessionComplete = () => {
    setActiveView("sessions");
    setSelectedSessionId(null);
  };

  const getActiveTabClasses = (tab: string) => {
    return activeView === tab
      ? "px-6 py-3 font-semibold text-primary-600 bg-gradient-to-r from-primary-50 to-primary-100 border-b-2 border-primary-500 rounded-t-container"
      : "px-6 py-3 font-medium text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-t-container transition-all duration-200";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Navigation */}
      <div className="glass-card rounded-container p-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveView("sessions")}
            className={getActiveTabClasses("sessions")}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Sessions</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView("new-session")}
            className={getActiveTabClasses("new-session")}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Session</span>
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="card p-8 min-h-[600px]">
        {activeView === "sessions" && (
          <SessionList
            sessions={sessions || []}
            onStartSession={handleStartSession}
            onViewReport={handleViewReport}
          />
        )}
        
        {activeView === "new-session" && (
          <NewSessionForm onSessionCreated={handleStartSession} />
        )}
        
        {activeView === "tracking" && selectedSessionId && (
          <EyeTrackingSession
            sessionId={selectedSessionId}
            onComplete={handleSessionComplete}
          />
        )}
        
        {activeView === "report" && selectedSessionId && (
          <SessionReport
            sessionId={selectedSessionId}
            onBack={() => setActiveView("sessions")}
          />
        )}
      </div>
    </div>
  );
}
