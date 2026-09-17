# FocusGuard

> **Stay Awake. Stay Focused.**

FocusGuard is a browser-based AI study companion designed to help
students stay alert during long study sessions. It uses real-time facial
landmark and eye analysis directly in the browser to detect prolonged
eye closure and provide an alert before drowsiness turns into lost study
time.

**Live Demo:** https://focus-guard-tawny.vercel.app/
------------------------------------------------------------------------

## ✨ Features

### 👁️ Real-Time Drowsiness Detection

Monitors eye activity through the webcam and detects prolonged eye
closure while you study.

### 🔔 Smart Anti-Sleep Alarm

Normal blinking is ignored. When the eyes remain closed beyond the
configured threshold, FocusGuard provides a warning and activates an
audible alarm.

### 📷 Local Camera Processing

Camera frames are processed locally in the browser. FocusGuard does not
require a backend server to analyze your webcam feed.

### ⏱️ Study Session Timer

Track active study time with controls for starting, pausing, and ending
sessions.

### 📊 Session History & Statistics

Review previous study sessions and monitor your study activity over
time.

### ⚙️ Customizable Settings

Adjust available monitoring, alarm, and study-session preferences to
match your workflow.

### 🎯 Focus Mode

Use a distraction-reduced interface while studying.

### 🔒 Privacy First

Your webcam is used for real-time detection in the browser. FocusGuard
is designed so that camera video is not uploaded or stored by the
application.

------------------------------------------------------------------------

## 🧠 How It Works

``` text
Webcam
   ↓
Browser Camera Access
   ↓
Facial Landmark Detection
   ↓
Eye / Blink Analysis
   ↓
Drowsiness Evaluation
   ↓
Warning → Alarm
   ↓
Eyes Reopen → Alarm Stops
```

FocusGuard performs its computer-vision processing on the client side,
allowing the core detection experience to work without sending webcam
footage to a remote backend.

------------------------------------------------------------------------

## 🛠️ Tech Stack

  Technology      Purpose
  --------------- ------------------------------------------------
  React           User interface and application architecture
  Vite            Development server and production build
  Tailwind CSS    Responsive UI styling
  MediaPipe       Real-time facial landmark / eye analysis
  Web APIs        Camera access, audio, and browser capabilities
  Local Storage   Local session/history persistence
  Vercel          Production deployment

------------------------------------------------------------------------

## 🚀 Getting Started

### Prerequisites

Make sure you have:

-   Node.js installed
-   npm installed
-   A modern browser with webcam support

### Installation

Clone the repository:

``` bash
git clone https://github.com/ciperpy/FocusGuard.git
cd FocusGuard
```

Install dependencies:

``` bash
npm install
```

Start the development server:

``` bash
npm run dev
```

Open the local URL shown by Vite, usually:

``` text
http://localhost:5173
```

### Production Build

To create a production build:

``` bash
npm run build
```

The optimized files are generated inside:

``` text
dist/
```

------------------------------------------------------------------------

## 🔐 Privacy

Privacy is a core part of FocusGuard's design.

-   🎥 Webcam access is requested only when needed.
-   🧠 Computer-vision processing happens in the browser.
-   🚫 Webcam video is not uploaded to a FocusGuard backend.
-   🚫 Camera recordings are not stored by the application.
-   💾 Session information is kept locally by the browser.

> Camera access is controlled by your browser. You can revoke camera
> permission at any time through your browser settings.

------------------------------------------------------------------------

## 🌐 Deployment

FocusGuard is a Vite-powered frontend application and can be deployed to
modern static hosting platforms.

The production version is deployed with Vercel and can be accessed from
the live demo above.

Future pushes to the connected GitHub repository can be deployed through
the hosting workflow.

------------------------------------------------------------------------

## 📁 Project Structure

``` text
FocusGuard/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AlarmOverlay.jsx
│   │   ├── CalibrationModal.jsx
│   │   ├── CameraPreview.jsx
│   │   ├── DetectionStatusCard.jsx
│   │   ├── FocusModeOverlay.jsx
│   │   ├── HistoryView.jsx
│   │   ├── LandingView.jsx
│   │   ├── Navbar.jsx
│   │   ├── PrivacyModal.jsx
│   │   ├── SessionStatsModal.jsx
│   │   ├── SettingsModal.jsx
│   │   └── StudyTimer.jsx
│   ├── hooks/
│   │   ├── useCamera.js
│   │   ├── useDrowsinessDetection.js
│   │   └── useStudyTimer.js
│   ├── services/
│   │   ├── audioService.js
│   │   ├── faceDetectionService.js
│   │   └── storageService.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── eyeDetection.js
│   │   └── time.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

------------------------------------------------------------------------

## 🎯 Intended Use

FocusGuard is built for students and anyone who spends long periods
studying or working in front of a computer.

It is intended as a lightweight productivity companion, not as a medical
or diagnostic system.

------------------------------------------------------------------------

## 🔮 Roadmap

Potential future improvements include:

-   [ ] More detailed study analytics
-   [ ] Advanced session insights
-   [ ] Improved accessibility
-   [ ] Additional alert options
-   [ ] More personalization controls
-   [ ] Optional offline-first enhancements
-   [ ] Expanded productivity features

------------------------------------------------------------------------

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

If you find an issue or have an idea that could improve FocusGuard, open
an issue or submit a pull request on GitHub.

------------------------------------------------------------------------

## 📄 License

This project currently does not declare a license.

If you plan to accept external contributions or distribute the project
under specific reuse terms, add an appropriate open-source license to
the repository.

------------------------------------------------------------------------
## 👨‍💻 Creator

**CIPERPY**

Building practical developer tools and student-focused technology projects.

- GitHub: [github.com/ciperpy](https://github.com/ciperpy)
- Website: [ciperpy.com](https://ciperpy.com)

---

<p align="center">
  <strong>Made with ❤️ by CIPERPY</strong>
</p>
