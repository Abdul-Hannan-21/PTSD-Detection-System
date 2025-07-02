import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface NewSessionFormProps {
  onSessionCreated: (sessionId: Id<"sessions">) => void;
}

export function NewSessionForm({ onSessionCreated }: NewSessionFormProps) {
  const [participantName, setParticipantName] = useState("");
  const [participantAge, setParticipantAge] = useState("");
  const [sessionType, setSessionType] = useState("screening");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createSession = useMutation(api.sessions.createSession);
  const initializeStimuli = useMutation(api.stimuli.initializeDefaultStimuli);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!participantName.trim()) {
      toast.error("Please enter participant name");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await initializeStimuli();
      
      const sessionId = await createSession({
        participantName: participantName.trim(),
        participantAge: participantAge ? parseInt(participantAge) : undefined,
        sessionType
      });

      toast.success("Session created successfully");
      onSessionCreated(sessionId);
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sessionTypes = [
    { value: "screening", label: "PTSD Screening", description: "Complete assessment with emotional stimuli" },
    { value: "calibration", label: "Calibration Only", description: "Eye tracking calibration and baseline" },
    { value: "complete", label: "Full Assessment", description: "Comprehensive analysis with extended stimuli set" }
  ];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-secondary-800 mb-2">Create New Session</h2>
        <p className="text-secondary-600">Set up a new PTSD screening session with advanced eye-tracking analysis</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="participantName" className="block text-sm font-semibold text-secondary-700 mb-3">
              Participant Name *
            </label>
            <input
              type="text"
              id="participantName"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className="input-field"
              placeholder="Enter participant's full name"
              required
            />
          </div>

          <div>
            <label htmlFor="participantAge" className="block text-sm font-semibold text-secondary-700 mb-3">
              Age (Optional)
            </label>
            <input
              type="number"
              id="participantAge"
              value={participantAge}
              onChange={(e) => setParticipantAge(e.target.value)}
              className="input-field"
              placeholder="Enter age"
              min="18"
              max="100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-secondary-700 mb-3">
            Session Type
          </label>
          <div className="grid gap-3">
            {sessionTypes.map((type) => (
              <label
                key={type.value}
                className={`relative flex items-start p-4 rounded-container border-2 cursor-pointer transition-all duration-200 ${
                  sessionType === type.value
                    ? "border-primary-300 bg-primary-50"
                    : "border-secondary-200 bg-white hover:border-secondary-300 hover:bg-secondary-50"
                }`}
              >
                <input
                  type="radio"
                  name="sessionType"
                  value={type.value}
                  checked={sessionType === type.value}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      sessionType === type.value
                        ? "border-primary-500 bg-primary-500"
                        : "border-secondary-300"
                    }`}>
                      {sessionType === type.value && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-800">{type.label}</h3>
                      <p className="text-sm text-secondary-600 mt-1">{type.description}</p>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-primary-800 mb-2">
                Pre-Session Checklist
              </h3>
              <ul className="space-y-2 text-sm text-primary-700">
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Ensure optimal lighting conditions (natural light preferred)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Position camera at eye level, 18-24 inches from participant</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Minimize environmental distractions and noise</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Allow 20-25 minutes for complete assessment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Obtain informed consent for eye-tracking analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-4 text-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Creating Session...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
              </svg>
              <span>Start Session</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
