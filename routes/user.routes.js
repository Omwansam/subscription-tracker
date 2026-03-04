const express = require('express');
const protect = require('../middleware/protect.middleware');
const authorize = require('../middleware/authorize.middleware')
const { 
  getProfile, 
  updateProfile, 
  changePassword, 
  deleteAccount, 
  getAllUsers, 
  getUserById, 
  updateUserRole, 
  deleteUserByAdmin, 
} = require('../controllers/user.controller');
const userRouter = express.Router();


// Example route for getting all users (Admin only)
userRouter.get('/', protect, authorize("admin"), getAllUsers);

// Example route for getting a single user by ID (Admin only)
userRouter.get('/:id', protect, authorize("admin"), getUserById);

// Example route for getting user profile
userRouter.get('/profile', protect, getProfile);

// Example route for updating user profile 
userRouter.post('/update', protect, updateProfile);

// Example route for changing user password
userRouter.put('/change-password', protect, changePassword);

// Example route for deleting user account

userRouter.delete('/delete-account', protect, deleteAccount);

// Example route for admin to update user role
userRouter.put('/:id/role', protect, authorize("admin"), updateUserRole);

// Example route for admin to delete a user
userRouter.delete('/:id', protect, authorize("admin"), deleteUserByAdmin);



module.exports = userRouter;