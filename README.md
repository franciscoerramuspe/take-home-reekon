# REEKON Robot Management Platform - Server

Backend server for the REEKON Robot Management Platform, providing API endpoints and business logic for robot management and monitoring.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  - Organization-level permissions
  - Session management

- **Robot Management API**
  - Robot CRUD operations
  - Real-time status updates
  - Location tracking
  - Battery monitoring
  - Error logging and management

- **Job Management API**
  - Job creation and assignment
  - Status tracking
  - Progress monitoring
  - Historical data and analytics

- **WebSocket Integration**
  - Real-time robot status updates
  - Live location tracking
  - Instant error notifications
  - Job status changes

- **Data Management**
  - Robot telemetry storage
  - Job history
  - Error logs
  - Analytics data

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT/Supabase


## Getting Started

1. **Important Note**
   The server must be running before starting the client application, as the client depends on the server's API endpoints and WebSocket connections.

2. **Prerequisites**
   - Node.js 18.17 or later
   - PostgreSQL 14 or later
   - npm or yarn package manager

3. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/franciscoerramuspe/take-home-reekon.git

   # Navigate to server directory
   cd take-home-reekon/server

   # Install dependencies
   npm install
   ```

4. **Environment Setup**
   - Contact Francisco Erramuspe to obtain the required `.env` file
   - The `.env` file contains sensitive configuration including:
     - Database credentials
     - JWT secrets
     - API configuration
   

5. **Running the Server**
   ```bash
   # Development mode
   npm run dev

   ```

## Project Structure

```
server/
├── src/
│   ├── controllers/    # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Helper functions
│   └── app.ts          # App entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── tests/              # Test files
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
