#  PTSD Detection Tool 

A clinical-grade, eye tracking-based PTSD screening system that enables real-time analysis of gaze behavior, pupil response, and stress indicators for efficient and insightful mental health assessment.

---

## Overview

This application is a modular, extensible web platform for PTSD screening, designed with modern UI/UX principles and backed by real-time data processing using the Convex backend. It includes session management, webcam-based eye tracking simulation, PTSD marker analysis, and professional clinical reporting.

---

##  Features

### Core Capabilities

* **Session Management:** Initiate, track, and store data for each screening.
* **Eye Tracking Pipeline:** Real-time webcam integration, calibration, and gaze data collection.
* **PTSD Analysis Engine:** Analysis based on clinically-researched indicators like pupil dilation, fixation duration, blink rate, and scanning patterns.
* **Clinical Reporting:** Auto-generated, print-ready reports with risk assessment and recommendations.

### Advanced Detection Features

* Support for multiple stimulus categories: neutral, emotional, and trauma-specific.
* Statistical analysis of autonomic and attentional markers.
* Research-based risk stratification into Low, Moderate, and High categories.

### Modern UI Design

* Responsive layout with accessibility in mind.
* Glassmorphism, gradient accents, and subtle animations.
* Clean navigation and progressive user flow.

---

##  Technology Stack

| Layer        | Technology           | Purpose                                   |
| ------------ | -------------------- | ----------------------------------------- |
| Frontend     | React + TypeScript   | UI development and state management       |
| Styling      | Tailwind CSS         | Utility-first styling framework           |
| Backend      | Convex               | Serverless data storage and logic         |
| Eye Tracking | Simulated (CV-ready) | Webcam capture and calibration            |
| Reporting    | Custom Engine        | Risk classification and PDF-ready reports |

---

## 🛠️ Getting Started

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory:

   ```env
   CONVEX_DEPLOY_KEY=your-convex-deploy-key
   CONVEX_DEPLOYMENT=dev:your-deployment-name
   VITE_CONVEX_URL=https://your-deployment.convex.cloud
   VITE_HOST=0.0.0.0
   VITE_PORT=5173
   ```

3. **Run Locally in Codespaces:**

   ```bash
   npm run dev
   ```

   Ensure Node.js v18+ is active using `nvm install 18 && nvm use 18`

---

## 🔧 Project Structure

```bash
/src
  /components       # Reusable React components
  /pages            # App views and flows
  /hooks            # Custom logic and data handlers
  /utils            # Helper functions
/convex
  schema.ts         # Convex DB schema
  functions.ts      # Convex backend functions
.env                # Environment variables
vite.config.ts      # Vite server config
```

---

## 🌐 Accessibility & Clinical Considerations

* Accessible design elements for all users
* Designed for integration with actual medical-grade hardware
* Clinical disclaimers embedded in reports
* Privacy-conscious data storage

---

## 🌟 Team Contribution

* Muhammad Sulman
* Abdul Hannan
* Abdul Mannan

---

**Note:** This tool is a screening aid and **not a diagnostic device**. Always consult with a licensed healthcare provider for clinical evaluations.


---
