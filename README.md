# 🗂 Dobby Drive

A premium, full-stack Google Drive-like Image Management Application. Built with React.js, Express.js, and MongoDB, housed entirely within a single project directory.

## 🚀 Features
- **Secure Authentication**: JWT-based user login and registration.
- **Nested Folder Structure**: Create infinite layers of nested folders just like a real file system.
- **Image Uploads**: Effortlessly upload images directly into your chosen folders.
- **Recursive Size Calculation**: See exactly how much space your folders and their sub-folders are occupying.
- **Premium Dark UI**: Human-crafted, responsive glassmorphism UI built without CSS frameworks.
- **Single-Folder Architecture**: Both frontend and backend effortlessly coexist in one folder, making deployment a breeze!

## 💻 Tech Stack
- **Frontend**: React.js, React Router, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Uploads**: Multer
- **Styling**: Vanilla CSS with CSS Variables

## 🛠 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. You will also need a MongoDB database instance (e.g., MongoDB Atlas).

### Installation

1. Clone the repository and navigate to the project folder:
   ```bash
   cd dobby-drive
   ```

2. Install all dependencies (this handles both frontend and backend dependencies):
   ```bash
   npm install
   ```

3. Configure your Environment Variables by creating a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

### Running the App Locally

To run both the React frontend and the Express backend simultaneously, simply run:
```bash
npm run dev
```

- **Frontend**: Available at `http://localhost:3000`
- **Backend API**: Running on port `5000`

## 📦 Deployment (Vercel)

This application is ready out-of-the-box for a single Vercel deployment. 
The included `vercel.json` automatically configures Vercel to route `/api/*` requests to the Express backend and handles the static React build for the frontend!

---
*Built with ❤️ for a seamless, beautiful file management experience.*
