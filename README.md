# FieldCare

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern healthcare management system built with React, TypeScript, and IndexedDB for offline-first functionality.

## Technical Stack

- **Frontend Framework**: React 18 with TypeScript
- **UI Components**: Material-UI v5
- **State Management**: React Context API
- **Database**: IndexedDB (via Dexie.js)
- **Authentication**: Firebase Authentication
- **Build Tool**: Vite
- **Package Manager**: npm

## Features

- Offline-first architecture with IndexedDB
- Real-time network status monitoring
- Secure authentication via Google OAuth
- Responsive Material Design UI
- Type-safe development with TypeScript
- Progressive Web App (PWA) capabilities

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Firebase project with Google Authentication enabled

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Installation

1. Extract the contents of the zip file to your desired location
2. Create a `.env` file in the root directory with the following Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Serve the production build:
   ```bash
   serve -s build
   ```

## Deployment

The application can be deployed to any static hosting service. The `build` folder contains the production-ready files.

## Requirements

- Node.js 14 or higher
- npm 6 or higher
- Modern web browser with JavaScript enabled

## Support

For support, please contact your system administrator or refer to the documentation.

## Project Structure

```
src/
├── auth/           # Authentication context and Firebase configuration
├── components/     # React components
├── db/            # Database configuration and types
├── services/      # Business logic and API services
└── types/         # TypeScript type definitions
```

## Database Schema

### Patients
```typescript
interface Patient {
  id?: number;
  name: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  lastVisit?: string;
}
```

### Visits
```typescript
interface Visit {
  id?: number;
  patientId: number;
  date: string;
  notes: string;
  vitalSigns: {
    bloodPressure?: string;
    temperature?: string;
    heartRate?: string;
    oxygenSaturation?: string;
  };
  medications?: string[];
  syncStatus: 'pending' | 'synced';
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
