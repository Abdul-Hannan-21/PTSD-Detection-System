import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";

function Logo() {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-medium">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-success-400 to-success-500 rounded-full border-2 border-white"></div>
      </div>
      <div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-secondary-800 to-secondary-600 bg-clip-text text-transparent">
          MindScope
        </h2>
        <p className="text-xs text-secondary-500 font-medium">PTSD Detection</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-card border-b border-white/20 h-16 flex justify-between items-center px-6">
        <Logo />
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1 p-6">
        <Content />
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500"></div>
          <p className="text-secondary-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Authenticated>
        <div className="mb-8 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary-800 via-primary-600 to-accent-600 bg-clip-text text-transparent">
              Advanced PTSD Detection System
            </h1>
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
              Revolutionary eye-tracking technology for non-invasive PTSD screening using advanced 
              pupillometry, gaze analysis, and emotional stimulus response patterns
            </p>
            <div className="flex justify-center space-x-8 mt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-secondary-700">Real-time Analysis</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-secondary-700">Clinical Grade</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-secondary-700">HIPAA Compliant</p>
              </div>
            </div>
          </div>
        </div>
        <Dashboard />
      </Authenticated>

      <Unauthenticated>
        <div className="max-w-md mx-auto mt-16 animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-strong">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary-800 to-primary-600 bg-clip-text text-transparent mb-4">
              Welcome to MindScope
            </h1>
            <p className="text-secondary-600">
              Advanced PTSD detection through eye-tracking analysis
            </p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
}
