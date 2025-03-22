# FieldCare - Nursing Visit Tracker

A Progressive Web App (PWA) designed for field nurses to track patient visits and manage care records while working offline. The app automatically syncs data when an internet connection is available.

## Features

- Offline-first functionality
- Patient management
- Visit tracking with vital signs
- Automatic data synchronization
- Mobile-friendly interface
- Installable as a PWA

## Tech Stack

- React + TypeScript
- Vite
- Material-UI
- Dexie.js (IndexedDB wrapper)
- PWA capabilities

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Development

The app uses the following key technologies:

- **Dexie.js**: For offline data storage using IndexedDB
- **Service Worker**: For offline functionality and caching
- **Material-UI**: For a responsive and modern UI
- **TypeScript**: For type safety and better development experience

## Offline Functionality

The app is designed to work completely offline:

1. All data is stored locally using IndexedDB
2. Changes are tracked with a sync status
3. When online, pending changes are automatically synchronized
4. The app can be installed on mobile devices for offline access

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
