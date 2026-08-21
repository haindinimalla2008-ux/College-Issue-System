# College Issue Management System

## 📌 About the Project

The College Issue Management System is a web-based application designed to help students, teachers, and administrators report, track, and manage problems within a college campus.

Instead of reporting issues manually, users can submit complaints online and administrators can monitor and update their status.

## 🎯 Problem

In many colleges, problems such as electrical issues, water problems, cleanliness, infrastructure damage, safety concerns, and academic issues may be reported manually.

This can make it difficult to:

* Track complaints
* Know who is handling an issue
* Identify urgent problems
* Monitor unresolved complaints
* Maintain a proper record of issues

## 💡 Solution

Our system provides a centralized platform where college users can submit issues and administrators can manage them efficiently.

Each complaint can be tracked using a complaint ID, and administrators can update its status.

## 🚀 Main Features

### 👨‍🎓 Student / User

* Submit a complaint
* Select an issue category
* Enter the issue location
* Describe the problem
* Receive a complaint ID
* Track complaint status

### 👨‍🏫 Teacher

* Report college-related issues
* Track submitted complaints
* Monitor issue status

### 👨‍💼 Administrator

* View submitted complaints
* View complaint details
* Monitor total complaints
* Update complaint status
* Manage pending, in-progress, and resolved issues

## 📊 Complaint Status

A complaint can have different statuses:

* **Pending** — The issue has been submitted but not started.
* **In Progress** — The issue is currently being handled.
* **Resolved** — The issue has been fixed.

## 🛠️ Technologies Used

* HTML
* CSS
* JavaScript
* Node.js
* Express.js
* MySQL
* Git
* GitHub

## 📁 Project Structure

```text
College-Issue-System/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   └── database.sql
│
├── frontend/
│   ├── index.html
│   ├── home.html
│   ├── login.html
│   ├── admin.html
│   ├── track.html
│   ├── script.js
│   ├── admin.js
│   ├── login.js
│   └── track.js
│
├── main.js
├── package.json
├── package-lock.json
└── .gitignore
```

## ▶️ How to Run

### 1. Clone the repository

```bash
git clone https://github.com/haindinimalla2008-ux/College-Issue-System.git
```

### 2. Open the project folder

```bash
cd College-Issue-System
```

### 3. Install dependencies

```bash
npm install
```

For the backend:

```bash
cd backend
npm install
```

### 4. Configure MySQL

Create the required database using:

```text
database/database.sql
```

Make sure MySQL is running and the database connection details in the backend are configured correctly.

### 5. Start the backend

```bash
node server.js
```

The server should run on:

```text
http://localhost:3000
```

## 🌟 Future Improvements

Possible future features include:

* Complaint priority prediction
* Email/SMS notifications
* Image upload for complaints
* Automatic issue prioritization
* Analytics and reports
* Mobile application
* AI-based complaint classification
* Location-based issue reporting

## 🏆 Project Goal

The goal of this project is to make college issue reporting faster, more transparent, and easier to manage while providing students, teachers, and administrators with a centralized system.

## 👥 Target Users

* Students
* Teachers
* College Administrators
* Maintenance Staff

## 📄 License

This project is developed as a student innovation project.
