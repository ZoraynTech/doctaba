# Doctaba - Telemedicine Platform

## Project Overview
Doctaba is a comprehensive telemedicine platform that enables secure video consultations between healthcare providers and patients. The application provides features for appointment scheduling, video calling, document management, and secure messaging.

## Recent Changes
- **2025-01-29**: Successfully migrated project from Replit Agent to standard Replit environment
- **2025-01-29**: Converted database storage from PostgreSQL to in-memory storage for better Replit compatibility
- **2025-01-29**: Fixed video call duplicate display issue by implementing comprehensive Jitsi configuration
- **2025-01-29**: Updated authentication system to work with in-memory storage and session management
- **2025-01-29**: Established proper client/server separation with security best practices

## Project Architecture

### Frontend (React + TypeScript)
- **Router**: Using wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Custom components built with Tailwind CSS and Lucide React icons
- **Pages**: 
  - HomePage: Dashboard with quick stats and actions
  - AppointmentsPage: Appointment management with video call integration
  - VideoCallPage: Full-featured video consultation interface
  - DocumentsPage: Medical document management
  - MessagesPage: Secure healthcare provider messaging

### Backend (Node.js + Express)
- **Server**: Express.js with TypeScript
- **Data Layer**: In-memory storage with full CRUD operations
- **API**: RESTful endpoints with proper validation using Zod schemas
- **Port**: Application runs on port 5000 (both frontend and backend)

### Data Schema
- **Users**: Supports both doctors and patients with role-based features
- **Appointments**: Video, phone, and in-person consultation scheduling
- **Messages**: Secure messaging between healthcare providers and patients
- **Documents**: Medical document storage and management

### Key Features
- **Video Consultations**: Full-featured video calling interface with controls
- **Appointment Management**: Schedule and join video consultations
- **Document Management**: Upload and organize medical documents
- **Secure Messaging**: HIPAA-compliant communication between users
- **Role-Based Access**: Separate interfaces for doctors and patients
- **Real-time Notifications**: Message and appointment notifications

## Development Environment
- **Vite**: Development server with hot module replacement
- **TypeScript**: Full type safety across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Drizzle ORM**: Type-safe database schema and operations

## Security Considerations
- Input validation using Zod schemas
- Proper client/server separation
- Type-safe API communication
- Secure authentication patterns ready for implementation

## User Preferences
*No specific user preferences recorded yet*

## Deployment
The application is configured for deployment on Replit with proper port configuration and environment setup.