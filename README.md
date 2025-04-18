# Hospital Management System

[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-Framework-blue.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-Library-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Environment-339933.svg)](https://nodejs.org/)

## Overview

The Hospital Management System is a web application designed to streamline hospital operations, manage patient records, and enhance the overall efficiency of healthcare services. This application is built using React for the frontend and Node.js with Express for the backend, along with MongoDB for data storage.

### 🌍 Deployed on Render (Live): [Visit Medi-Track](https://medi-track-wvrc.onrender.com)

## Features

- User authentication for patients, doctors, and admins.
- Patient management including records, appointments, prescriptions and history.
- Doctor management with profiles, appointment history and schedules.
- Admin dashboard for overseeing hospital operations.
- Responsive design for mobile and desktop users.

## Technologies Used

- **Frontend:**
  - React
  - React Router
  - Tailwind CSS
  - Lucide Icons
  - React-Hot-Toast
  - Axios for API calls

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - JWT for authentication
  - dotenv for environment variable management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### ENV file setup
```.env
PORT=your_port
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/aishwary-dixit1/Medi-Track.git
   ```

2. Navigate to the frontend directory and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

3. Navigate to the backend directory and install dependencies:

   ```bash
   cd backend
   npm install
   ```

4. Update a `/backend/server.js` & `/backend/createAdmin.js` file in the backend directory and add your MongoDB connection string:

   ```js
   // MongoDB connection
   mongoose.connect('<your_MongoDB_connection_string>', {
   ```
5. To create first admin, add your details to `/backend/createAdmin.js` file in backend directory:

    ```js
    const admin = new Admin({
      firstName: "admin",
      lastName: "Demo",
      email: "admin@gmail.com",
      password: "admin123", 
      role: "admin"
    });
    ```

    Then, execute it once using:
  
    ```bash
    node createAdmin.js
    ```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   node server.js
   ```

2. Start the frontend application:

   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to view the application.

## Available Scripts

In the frontend directory, you can run:

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner.
- `npm run build`: Builds the app for production.
- `npm run eject`: Ejects the configuration files.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.
