# Subscription Tracker - Backend API

A production-ready Node.js and Express.js backend API for managing user subscriptions, authentication, and user management. This project includes JWT-based authentication, role-based authorization, MongoDB integration with Mongoose, and comprehensive error handling.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

✅ **User Authentication** - Register, login, and logout with JWT tokens  
✅ **User Management** - Profile management, password change, account deletion  
✅ **Admin Controls** - User role management and admin-only operations  
✅ **Subscription Management** - Subscribe, unsubscribe, and manage subscription plans  
✅ **MongoDB Integration** - Mongoose ORM for database operations  
✅ **Security** - Password hashing with bcrypt, JWT token validation, protected routes  
✅ **Cookie Support** - HTTP-only cookies for secure token storage  
✅ **Error Handling** - Centralized error handling middleware  
✅ **Development Tools** - ESLint for code quality, Nodemon for hot reload  

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v7 or higher) - Usually comes with Node.js
- **MongoDB** (v5.0 or higher) - [Install locally](https://docs.mongodb.com/manual/installation/) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud database
- **Git** - For version control

### Verify Installation

Check your installed versions:

```bash
node --version
npm --version
```

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd express
```

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install the following main dependencies:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** & **bcrypt** - Password hashing
- **dotenv** - Environment variable management
- **cookie-parser** - Cookie parsing middleware

## Environment Configuration

### Create a `.env` File

Create a `.env` file in the root directory of the project:

```bash
touch .env
```

### Add Environment Variables

Add the following environment variables to your `.env` file:

```env
# Server Port
PORT=5000

# MongoDB Connection URI
# For local MongoDB:
# DB_URI=mongodb://localhost:27017/subscription-tracker
# For MongoDB Atlas (cloud):
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/subscription-tracker?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

### Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `DB_URI` | MongoDB connection string | `mongodb://localhost:27017/subscription-tracker` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secret_key_here` |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d`, `24h`, `3600` |
| `NODE_ENV` | Environment (development/production) | `development` |

### MongoDB Setup

#### Option 1: Local MongoDB

Install MongoDB on your system and start the MongoDB service:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo systemctl start mongod

# Windows
net start MongoDB
```

Verify MongoDB is running:

```bash
mongosh
# or older version
mongo
```

#### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string and add it to `.env`

Example MongoDB Atlas URI:
```
mongodb+srv://username:password@cluster-name.mongodb.net/dbname?retryWrites=true&w=majority
```

## Running the Project

### Development Mode (with Hot Reload)

Run the project in development mode with automatic restart on file changes:

```bash
npm run dev
```

The server will start with Nodemon watching for changes. Output:
```
Express app listening at http://localhost:5000
```

### Production Mode

Run the project in production mode:

```bash
npm start
```

### Verify the Server is Running

Test if the server is running:

```bash
curl http://localhost:5000
# Response: "Hello Backend Working!"
```

Or visit `http://localhost:5000` in your browser.

## Project Structure

```
express/
├── index.js                      # Main application entry point
├── package.json                  # Dependencies and scripts
├── eslint.config.mjs             # ESLint configuration
├── .env                          # Environment variables (create this)
├── .gitignore                    # Git ignore file
│
├── config/
│   └── env.js                    # Environment configuration loader
│
├── database/
│   └── mongodb.js                # MongoDB connection setup
│
├── models/
│   ├── user.model.js             # User schema and model
│   └── subscription.model.js      # Subscription schema and model
│
├── controllers/
│   ├── auth.controller.js         # Authentication logic
│   └── user.controller.js         # User management logic
│
├── routes/
│   ├── auth.routes.js             # Authentication routes
│   ├── user.routes.js             # User management routes
│   └── subscription.routes.js      # Subscription routes
│
├── middleware/
│   ├── errorHandler.js            # Error handling middleware
│   ├── protect.middleware.js       # JWT verification middleware
│   └── authorize.middleware.js     # Role-based authorization middleware
│
└── README.md                     # This file
```

## API Endpoints

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `POST` | `/auth/register` | Register a new user | ❌ No |
| `POST` | `/auth/login` | Login user | ❌ No |
| `POST` | `/auth/logout` | Logout user | ✅ Yes |

### User Routes (`/user`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|----------------|------|
| `GET` | `/user/` | Get all users | ✅ Yes | Admin |
| `GET` | `/user/:id` | Get user by ID | ✅ Yes | Admin |
| `GET` | `/user/profile` | Get own profile | ✅ Yes | User |
| `POST` | `/user/update` | Update profile | ✅ Yes | User |
| `PUT` | `/user/change-password` | Change password | ✅ Yes | User |
| `DELETE` | `/user/delete-account` | Delete own account | ✅ Yes | User |
| `PUT` | `/user/:id/role` | Update user role | ✅ Yes | Admin |
| `DELETE` | `/user/:id` | Delete user | ✅ Yes | Admin |

### Subscription Routes (`/subscription`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `GET` | `/subscription/` | Get all subscriptions | ❌ No |
| `GET` | `/subscription/plans` | Get subscription plans | ❌ No |
| `GET` | `/subscription/status` | Check subscription status | ❌ No |
| `POST` | `/subscription/subscribe` | Subscribe to service | ❌ No |
| `POST` | `/subscription/unsubscribe` | Unsubscribe from service | ❌ No |

## Authentication & Authorization

### How JWT Authentication Works

1. **Registration** → User registers with email and password
2. **Login** → User receives JWT token (stored in cookies/headers)
3. **Protected Requests** → Include token in Authorization header or cookies
4. **Token Verification** → Middleware verifies token validity

### Using Protected Routes

Include the JWT token in your request header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/v1/user/profile
```

### Role-Based Authorization

Routes can require specific roles (e.g., "admin"). The authorization middleware checks the user's role:

```javascript
// Only admin users can access this route
router.get('/', protect, authorize("admin"), getAllUsers);
```

### Available Roles

- `user` - Standard user role
- `admin` - Administrator role with full access

## Development

### Code Quality with ESLint

```bash
# Run ESLint to check code quality
npx eslint .
npx eslint . --fix  # Auto-fix issues
```

### Nodemon Configuration

Nodemon automatically restarts the server when files change. It's configured to watch all `.js` files.

### Testing API Routes

Use **Postman** or **cURL** to test API endpoints:

```bash
# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get user profile (replace TOKEN with actual JWT)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/v1/user/profile
```

### Debugging

Add console logs in controllers/middleware:

```javascript
console.log('Request received:', req.body);
```

Check the terminal output when running in `dev` mode.

## Troubleshooting

### Common Issues and Solutions

#### 1. **Port Already in Use**

Error: `Error: listen EADDRINUSE: address already in use :::5000`

Solution:
```bash
# Find and kill process using port 5000
lsof -i :5000
kill -9 <PID>

# Or use a different port
PORT=5001 npm run dev
```

#### 2. **MongoDB Connection Failed**

Error: `Error: connect ECONNREFUSED 127.0.0.1:27017`

Solution:
- Ensure MongoDB is running
- Check your `DB_URI` in `.env`
- For MongoDB Atlas, verify IP whitelist includes your IP

```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017"
```

#### 3. **JWT Token Invalid**

Error: `JsonWebTokenError: jwt malformed`

Solution:
- Ensure `JWT_SECRET` in `.env` matches what's used for signing
- Check token format in Authorization header: `Bearer TOKEN`

#### 4. **Module Not Found**

Error: `Cannot find module 'express'`

Solution:
```bash
npm install
```

#### 5. **Environment Variables Not Loading**

Error: `Cannot read property 'PORT' of undefined`

Solution:
- Verify `.env` file exists in root directory
- Restart the server after creating/modifying `.env`
- Check that variable names match exactly

### Getting Help

- Check MongoDB logs: `tail -f /var/log/mongod.log`
- Check Node.js version compatibility
- Review error messages in terminal output
- Check the controllers and routes for implementation details

## License

MIT License - See LICENSE file for details

---

**Author:** Omwansa Arnold  
**Version:** 1.0.0  
**Last Updated:** March 2026

### Quick Start Checklist

- [ ] Install Node.js and npm
- [ ] Clone the repository
- [ ] Run `npm install`
- [ ] Create `.env` file with required variables
- [ ] Start MongoDB service
- [ ] Run `npm run dev` for development
- [ ] Test API endpoints with Postman/cURL
- [ ] Check console output for any errors

Happy coding! 🚀
