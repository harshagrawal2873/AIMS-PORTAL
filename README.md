# Academic Information Management System

A full-stack web application designed to simplify academic administration. This system enables administrators to manage users (faculty and students), batches, courses, and course results—all in one place.

---

## Features

### User Management
- **Create and Manage Users:**  
  - Create and view both faculty and student profiles.
  - Ensure that every student is assigned to a batch.
  
- **Batch Management:**  
  - Create batches with unique names.
  - Assign a Faculty Advisor to each batch.
  - View and manage existing batches.

### Course Management
- **Course Creation & Approval:**  
  - Faculty members can create courses.
  - Admin approval is required for a course to be available for student enrollment.
  
- **Enrollment Process:**  
  - When a student enrolls in an approved course, an enrollment request is sent to the Faculty Advisor of the student’s batch.
  - Upon approval, the course is added to the student’s course list.

### Result Management
- **Grading:**  
  - Admins can view each course and grade enrolled students through a dedicated grading interface.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Seeding](#database-seeding)
- [Usage](#usage)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [License](#license)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js (LTS version recommended)](https://nodejs.org/)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (for cloud-hosted database)

---

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/AIMS-portal.git
   cd AIMS-portal
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

---

## Configuration

1. **Set Up Environment Variables:**

   Create a `.env` file in the root directory. Add the following variables (ensure you replace placeholders with your actual values):

   ```env
   # MongoDB Atlas connection string (replace <username>, <password>, and <dbname>)
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority"

   # Email credentials for SMTP (for OTP and notifications)
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-16-digit-app-password"

   # JWT secret for authentication and RBAC
   JWT_SECRET="your_long_random_secret_string"
   ```

   **Important:**  
   - For email functionality, ensure you have enabled 2-step verification on your Gmail account and generated an app password.
   - Keep your `JWT_SECRET` secure as it is essential for token-based authentication.

---

## Database Seeding

### Seeding Admin Users

This application provides a secure interface to seed initial admin users. **Note:** The seeder script should be disabled in production to prevent unauthorized access.

1. **Run the Seeder Script:**

   Open a terminal in the project root and execute:

   ```bash
   node app/api/seed/route.js
   ```

2. **Access the Admin Seeder Page:**

   Open your browser and navigate to:  
   [http://localhost:5000/admin-seeder](http://localhost:5000/admin-seeder)

3. **Seed New Admins:**

   - Enter the admin’s name and email (e.g., `useremail+admin1@gmail.com`).
   - Click the "Add Admin" button to create a new admin.
   - Existing admins are listed to avoid duplication, and delete options are provided.
   - Also we can remove some admin from the database too from there only .

---

## Usage

Once the database is seeded and the application is configured, you can use the system as follows:

### 1. Admin User Management Panel

- **Create User:**  
  Add new users (faculty or student).  
  > **Note:** For students, ensure a batch has been created first.

- **View Users:**  
  Access a complete list of all registered users.

### 2. Batch Management

- **Create Batch:**  
  - Provide a unique batch name.
  - Specify the branch (e.g., Computer Science and Engineering).
  - Assign a Faculty Advisor from the available faculty list.

- **View Batches:**  
  Display all created batches.

### 3. Course Management

- **Approve Courses:**  
  - Faculty create courses that need admin review.
  - Only approved courses are available for enrollment.

- **Enrollment Requests:**  
  - When a student enrolls, an enrollment request is sent to the Faculty Advisor.
  - Once approved, the course is added to the student’s course list.

### 4. Result Management

- **Grade Courses:**  
  - Admins can view enrolled students for each course.
  - Grades can be assigned directly from the grading interface.

---

## Deployment

Deploy the project on your preferred hosting platform (e.g., Heroku, Vercel, or a VPS) by following these steps:

1. **Configure Environment Variables:**  
   Ensure your deployment platform is set up with all necessary environment variables (`MONGODB_URI`, `EMAIL_USER`, `EMAIL_PASS`, `JWT_SECRET`).

2. **Deploy and Test:**  
   - Deploy the application.
   - Verify that all functionalities (user, batch, course, and result management) work as expected.
   - Test email notifications and authentication flows.

3. **Security Reminder:**  
   Disable the admin seeder script in production to avoid unauthorized admin access.

---

## Project Structure

A brief overview of the project’s structure:

```
AIMS-portal/
├── app/
│   ├── api/
│   │   ├── seed/
│   │   │   └── route.js       # Admin seeder script
│   │   └── ...                # Other API endpoints
├── config/
│   └── ...                    # Configuration files
├── public/
│   └── ...                    # Frontend assets
├── views/
│   └── ...                    # Template files (if applicable)
├── .env                       # Environment variables (not tracked in version control)
├── package.json
└── README.md
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---
