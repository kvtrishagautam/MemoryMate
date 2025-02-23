# MemoryMate

MemoryMate is a React Native mobile application designed to support Alzheimer's patients and their caregivers. The app facilitates daily care management, medication tracking, and communication between patients and their caregivers.

## Features

### For Patients
- Secure Login: Dedicated patient portal with email-based authentication
- Medication Tracking: Keep track of medication schedules and dosages
- Daily Activities: Monitor and record daily activities
- Emergency Contacts: Quick access to caregiver and emergency contacts
- User-Friendly Interface: Simple and intuitive design for ease of use

### For Caregivers
- Caregiver Dashboard: Comprehensive view of assigned patients
- Patient Management: Monitor and manage patient activities
- Medication Management: Set and track medication schedules
- Profile Management: Update and manage patient profiles
- Real-time Updates: Get immediate updates on patient activities

## Tech Stack
- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data
- **Navigation**: Expo Router

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Supabase account

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/kvtrishagautam/MemoryMate.git
   cd MemoryMate
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up Supabase
   - Create a new Supabase project
   - Update Supabase configuration in `app/lib/supabase.js` with your project URL and anon key

4. Start the development server
   ```bash
   npx expo start
   ```

## Project Structure
```
MemoryMate/
├── app/
│   ├── screens/
│   │   ├── auth/          # Authentication screens
│   │   ├── patient/       # Patient-specific screens
│   │   └── caretaker/     # Caretaker-specific screens
│   ├── components/        # Reusable components
│   ├── lib/              # Utilities and configurations
│   └── context/          # React Context providers
├── assets/               # Images, fonts, etc.
└── package.json
```

## Database Schema

### Users Table
- id (primary key)
- email
- password
- role (patient/caretaker)

### Patients Table
- id (primary key)
- user_id (foreign key)
- full_name
- medical_conditions
- age

### Caretakers Table
- id (primary key)
- user_id (foreign key)
- full_name
- specialization

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please email support@memorymate.com or open an issue in the GitHub repository.
