# 🎓 IERMS - Institutional Event & Resource Management System

![Project Status](https://img.shields.io/badge/Status-Prototype-blue)
![Tech Stack](https://img.shields.io/badge/Stack-React%20|%20Firebase%20|%20Tailwind-indigo)

A premium, role-based event management platform designed for educational institutions. IERMS streamlines the entire event lifecycle from proposal to completion, featuring a multi-level approval workflow, intelligent resource allocation, and a stunning, professional user interface.

## ✨ Key Features

### 🎭 Role-Based Access Control
Secure, distinct dashboards for 5 user roles:
- **Event Coordinator**: Create and manage event requests.
- **HOD (Head of Department)**: First-level approval for department events.
- **Dean**: Second-level strategic approval.
- **Institutional Head**: Final approval with resource allocation authority.
- **Admin / ITC**: Manage venues, resources, and system settings.

### 🚀 Automated Workflows
- **Multi-Level Approval**: Events automatically progress through the hierarchy (HOD → Dean → Head).
- **Smart Resource Allocation**: Automatic validation of venue capacity and resource availability upon final approval.
- **Conflict Detection**: Prevents double-booking of venues and resources.
- **Real-Time Tracking**: Live status updates at every stage of the application.

### 🎨 Premium UI/UX
- **Modern Design System**: Built with a professional blue/indigo color palette.
- **Responsive Layouts**: Fully responsive dashboards and forms.
- **Glassmorphism & Animations**: Smooth transitions and modern aesthetic.
- **Interactive Dashboards**: Data-rich views with status badges and quick actions.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Backend Service**: Firebase (Authentication, Firestore, Analytics)
- **Routing**: React Router v6
- **Icons**: Heroicons

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- A Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd institutional_management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173` to view the application.

## 🔑 Test Credentials

Use these pre-configured accounts to test different roles and workflows:

| Role | Email | Password |
|------|-------|----------|
| **Event Coordinator** | `coordinator@ierms.edu` | `password123` |
| **HOD (CSE)** | `hod.cse@ierms.edu` | `password123` |
| **Dean** | `dean@ierms.edu` | `password123` |
| **Institutional Head** | `head@ierms.edu` | `password123` |
| **Admin / ITC** | `admin@ierms.edu` | `password123` |

## 📱 Application Flow

1. **Registration**: Users register with their specific role (Coordinator, HOD, etc.).
2. **Event Creation**: Coordinators submit detailed event proposals (Schedule, Venue, Resources).
3. **Approval Chain**:
   - **HOD** reviews and approves.
   - **Dean** reviews and approves.
   - **Institutional Head** grants final approval, triggering resource allocation.
4. **Execution**: Coordinator marks event as 'Started' and finally 'Completed', releasing resources back to the pool.

## 🛡️ Security

- **Authentication**: Powered by Firebase Authentication.
- **Authorization**: Protected routes ensure users only access authorized dashboards.
- **Data Safety**: Firestore security rules (configured in console) protect data integrity.

## 🤝 Contribution

Contributions are welcome! Please fork the repository and submit a pull request.

---
*Built with ❤️ for Institutional Excellence*
