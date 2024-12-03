# GPA & CGPA Converter

A web application built using the MERN stack that allows users to calculate their GPA and CGPA with an intuitive interface. The app includes features like user authentication, department and course management, and a circular scale for visualizing CGPA.

## Features

- **User Authentication**: 
  - Signup and login using roll number and department.
  - Welcome users by name upon successful login.

- **GPA Calculator**:
  - Dropdown to select courses and grades.
  - Add or delete input rows dynamically.
  - Calculate GPA based on the formula:  
    \[
    GPA = \frac{\text{Sum of (Credits × Grade Points)}}{\text{Total Credits}}
    \]
  - GPA displayed inside a circular ratio.

- **CGPA Tracker**:
  - Supports calculations for up to 8 semesters.
  - Stores and retrieves CGPA data for each user.
  - Displays CGPA with a circular scale, rounded to two decimal places.

- **Admin Dashboard**:
  - View all CGPA records.
  - Add new departments and courses (course title, code, and credit score).

## Tech Stack

### Frontend
- **React**: For building the user interface.
- **Axios**: For API requests.

### Backend
- **Node.js**: Server-side runtime.
- **Express.js**: Backend framework for building RESTful APIs.
- **MongoDB**: Database for storing user data, CGPA records, departments, and courses.
- **Mongoose**: ODM library for MongoDB.

### Deployment
- **Hosted on Vercel** - [Live Demo](https://gpa-converter-client.vercel.app/).

### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB
- npm or yarn
