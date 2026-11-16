# CIS 3339 Homework 1: Vue 3 and MongoDB Migration

## Project Overview

This project is a Student Management System built with Vue 3, Node.js, Express, and MongoDB.

The application supports:

- Adding, searching, displaying, and deleting students
- Adding, listing, and deleting courses
- Enrolling students in courses
- Preventing duplicate students, courses, and enrollments
- Listing students enrolled in a selected course
- Automatically deleting related enrollments when a student or course is deleted
- MongoDB persistence
- Vue Router navigation
- Pinia shared state
- Responsive user interface
- Production deployment through Express

## Required Software

Install the following before running the project:

- Node.js
- npm
- MongoDB Community Edition
- A modern web browser

## Environment Configuration

The backend uses the submitted `.env` file located inside the `backend` folder.

The configuration is:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/cis3339_homework1
PORT=3000
```

No MongoDB username, password, cloud account, or MongoDB Atlas configuration is required.

The application automatically creates the required MongoDB database, collections, schemas, and indexes when they are first needed.

No manual database creation, migration, seed, or import is required.

## Start MongoDB

MongoDB Community Edition must be running before starting the application.

On macOS with Homebrew:

```bash
brew services start mongodb-community
```

To verify that MongoDB is installed:

```bash
mongod --version
```

To verify the local database connection:

```bash
mongosh "mongodb://127.0.0.1:27017/cis3339_homework1"
```

Exit MongoDB Shell with:

```text
exit
```

## Install Dependencies

From the root project directory, run:

```bash
npm install
```

The root `postinstall` script installs both backend and frontend dependencies automatically.

## Build the Production Frontend

From the root project directory, run:

```bash
npm run build
```

This creates the Vue production files inside:

```text
frontend/dist
```

## Start the Production Application

From the root project directory, run:

```bash
npm start
```

The server connects to MongoDB and serves the Vue production application.

Expected terminal output:

```text
Connected to MongoDB
Server is running on http://localhost:3000
```

## Open the Application

Open the following URL in a web browser:

```text
http://localhost:3000/
```

The Courses page is available at:

```text
http://localhost:3000/courses
```

Refreshing the Courses route directly is supported and should not return a 404 error.

## Standard Production Workflow

For a fresh installation:

```bash
npm install
npm run build
npm start
```

Then open:

```text
http://localhost:3000/
```

## Development Mode

For frontend development, start the backend first:

```bash
cd backend
npm start
```

Then open another terminal and start the Vue development server:

```bash
cd frontend
npm run dev
```

The development frontend runs at:

```text
http://localhost:5173/
```

Vite proxies `/api` requests to the Express backend running on port `3000`.

## Project Structure

```text
CIS-3339-Homework1-
├── backend
│   ├── models
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   └── Student.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── AppNav.vue
│   │   │   └── StatusMessage.vue
│   │   ├── router
│   │   ├── stores
│   │   │   └── app.js
│   │   ├── views
│   │   │   ├── CoursesView.vue
│   │   │   └── StudentsView.vue
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── package.json
│   └── vite.config.js
├── images
├── .gitignore
├── package.json
└── README.md
```

## Student Features

The Students view allows users to:

- Add a student
- Enter name, student ID, phone number, and ZIP code
- Search for a student by name
- Display student information
- Delete a student
- Reject duplicate student IDs
- Validate required fields
- Display success, validation, loading, and error messages

## Course Features

The Courses view allows users to:

- Add a course
- Enter a course ID and course name
- List existing courses
- Delete courses
- Reject duplicate course IDs
- Validate required fields

## Enrollment Features

The application allows users to:

- Select students returned by the backend
- Select courses returned by the backend
- Enroll a student in a course
- Reject duplicate enrollments
- Select a course and display enrolled students

## MongoDB Data

MongoDB stores three types of records:

- Students
- Courses
- Enrollments

Student IDs are unique.

Course IDs are unique.

A student cannot be enrolled in the same course more than once.

Deleting a student automatically removes that student's enrollments.

Deleting a course automatically removes that course's enrollments.

The completed application does not use JSON files as a database.

## Production API

Backend API routes use the `/api` prefix.

Examples:

```text
GET  /api/students
GET  /api/courses
POST /api/find-student
POST /api/add-student
POST /api/delete-student
POST /api/add-course
POST /api/delete-course
POST /api/enroll-student
POST /api/students-in-course
```

## Technologies Used

- Vue 3
- Vue Composition API
- Vue Router
- Pinia
- Vite
- Node.js
- Express
- MongoDB Community Edition
- Mongoose

## Notes

- MongoDB must be running before `npm start`.
- The real local `.env` file is included with the project.
- No external database service is required.
- `node_modules` is excluded from Git.
- The application is designed to run completely on localhost.