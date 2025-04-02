# Event Registration and Tracking System

A streamlined platform for event registration, attendee tracking via QR codes, and admin management. Built with React and Firebase.

## Project Overview

This application allows event organizers to create and manage events while providing attendees with a simple registration process. The system generates unique QR codes for each registration which can be scanned for check-ins at the event. Administrators have access to a dashboard for managing events, tracking attendance, and generating detailed reports.

## Key Features

- **User Registration**: Easy sign-up for events with email confirmation
- **QR Code Integration**: Unique QR codes for attendees that can be scanned for check-ins
- **Admin Dashboard**: Comprehensive tools to manage events, view registrations, and generate reports
- **Export Capabilities**: Download attendee data as PDF or Excel sheets
- **Real-Time Tracking**: Monitor event attendance via QR scans

## Getting Started

### Prerequisites
- Node.js (v14 or newer)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```
git clone https://github.com/your-username/registration-app.git
cd registration-app
```

2. Install dependencies
```
npm install
# or
yarn install
```

3. Configure Firebase

Create a `firebase.js` file in the `src` directory with your Firebase configuration:

```javascript
// Add your Firebase configuration here
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
```

> **Important**: Replace the placeholder values with your actual Firebase configuration. Never commit your real Firebase config to public repositories.

4. Start the development server
```
npm run dev
# or
yarn dev
```

## Technical Details

This project was created using Vite and React.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## License

[MIT](LICENSE)
