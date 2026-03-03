const express = require('express');
const { registerUser,loginUser, logoutUser,} = require('../controllers/auth.controller');
const authRouter = express.Router();

// Example route for user registration

authRouter.post('/register', registerUser );

// Example route for user login
authRouter.post('/login', loginUser );

// Example route for user logout
authRouter.post('/logout', logoutUser);


module.exports = authRouter;