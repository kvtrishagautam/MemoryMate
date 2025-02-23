# MemoryMate

MemoryMate is an open-source React Native app designed to support Alzheimer's patients and their caregivers. The app provides daily reminders, memory games, voice mails, and emergency contacts to enhance daily life and emotional connections.

## Features

### For Patients
- Daily Reminders: Set reminders for medications, meals, and appointments
- Memory Games: Play games to stimulate cognitive function
- Voice Mails: Listen to recorded messages from family members
- Emergency Contacts: Quick access to emergency contacts
- Photo Recognition: Identify family members and objects using AI
- Location Tracking: Share real-time location with caregivers (optional)
- Offline Mode: Use the app without an internet connection

### For Caregivers
- Caregiver Dashboard: Manage reminders, track location, and view activity logs
- Voice Mail Recording: Record and send voice messages to the patient
- Medication Tracker: Input and monitor medication schedules
- Safe Zones: Set safe zones and receive alerts if the patient wanders

## Tech Stack
- Frontend: React Native (for cross-platform mobile apps)
- Backend: Firebase (for real-time data sync and storage)
- Database: Firestore (for cloud storage) and SQLite (for local storage)
- AI: TensorFlow Lite (for photo recognition)
- Audio Handling: react-native-sound or react-native-voice
- Navigation: React Navigation
- State Management: Redux or Context API

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```

2. Set up Firebase
   - Create a new Firebase project
   - Add your Firebase configuration in `app/config/firebase.js`
   - Enable Authentication and Firestore

3. Start the app
   ```bash
   npx expo start
   ```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
