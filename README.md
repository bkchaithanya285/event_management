# IERMS - Institutional Event Resource Management System

A hackathon-ready event management platform with role-based approval workflows and resource allocation.

## 🚀 Features

- **Role-Based Access Control**: 5 distinct user roles (Event Coordinator, HOD, Dean, Institutional Head, Admin/ITC)
- **Multi-Level Approval Workflow**: Events progress through HOD → Dean → Institutional Head
- **Resource Allocation**: Automatic resource validation and allocation on final approval
- **Venue Management**: Track venue capacity and availability
- **Event Lifecycle**: From submission to completion with resource release
- **Clean UI**: Built with Tailwind CSS for a professional look

## 📋 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **Routing**: React Router v6

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Firebase account

### 1. Clone and Install Dependencies

```bash
cd institutional_management
npm install
```

### 2. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** → Email/Password provider
3. Create a **Firestore Database** in test mode (or production mode with rules)
4. Copy your Firebase config from Project Settings

### 3. Environment Variables

Create a `.env` file in the root directory (use `.env.example` as template):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

### 4. Firestore Collections

The app expects these collections (they'll be created automatically when you first use them):
- `users` - User profiles with roles
- `events` - Event requests and details
- `venues` - Available venues
- `resources` - Resource inventory (food, equipment, facilities, ITC services)

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173`

## 👥 User Roles & Workflows

### Event Coordinator
- Create event requests
- View event status
- Start approved events
- Complete events and release resources

### HOD (Head of Department)
- Review department event requests
- Approve/Reject/Request modifications

### Dean
- Review HOD-approved events
- Approve/Reject events

### Institutional Head
- Final approval of Dean-approved events
- Resource allocation happens here:
  - Validates venue capacity
  - Checks resource availability
  - Allocates resources if valid
  - Rejects with explanation if invalid

### Admin/ITC
- Manage venues (add/edit/delete)
- Manage resources (add/edit/delete)
- Update availability

## 🔐 Security Considerations

### Firestore Security Rules (Recommended)

Add these rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events - role-based access
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'EventCoordinator';
      allow update: if request.auth != null;
    }
    
    // Venues and Resources - Admin only
    match /venues/{venueId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'AdminITC';
    }
    
    match /resources/{resourceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'AdminITC';
    }
  }
}
```

## 🧪 Testing the Application

### 1. Create Test Users
Register users with different roles using the registration form.

### 2. Add Resources (Admin)
Log in as Admin/ITC and add:
- Venues (e.g., Main Auditorium, Conference Hall)
- Resources:
  - Food (type: food)
  - Projector (type: equipment)
  - WiFi (type: facility)
  - Live Streaming (type: itc)

### 3. Test Approval Workflow
1. Login as Event Coordinator → Create an event
2. Login as HOD → Approve the event
3. Login as Dean → Approve the event
4. Login as Institutional Head → Final approve (resources allocated)
5. Login as Event Coordinator → Start event → Complete event (resources released)

### 4. Test Rejection Scenarios
Try rejecting at any level to see rejection reason flow

## 📁 Project Structure

```
institutional_management/
├── src/
│   ├── components/
│   │   ├── auth/              # Login, Protected Routes
│   │   ├── dashboards/        # Role-specific dashboards
│   │   └── events/            # Event form and list
│   ├── contexts/              # Auth context
│   ├── config/                # Firebase config
│   ├── types/                 # Type definitions
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind styles
├── .env.example               # Environment template
├── package.json
└── README.md
```

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify `.env` file is in the root directory
- Check that all Firebase config values are correct
- Ensure Firebase Authentication and Firestore are enabled

### Role Not Showing Correct Dashboard
- Check that the user document in Firestore has the correct `role` field
- Logout and login again to refresh role state

### Resource Allocation Failing
- Ensure Admin has added venues and resources
- Check that resource names match exactly (case-insensitive comparison is implemented)
- Verify venue capacity is sufficient

## 📝 License

This project is created for hackathon/educational purposes.

## 🤝 Contributing

This is a prototype. Feel free to extend with:
- Email notifications
- Calendar integration
- Advanced resource scheduling
- Analytics dashboard
- Mobile responsive improvements
