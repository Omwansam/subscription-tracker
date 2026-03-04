const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/env");


const registerUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Registration logic goes here
    const {fullName, email, password} = req.body;

    if (!fullName || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    
    
    if (existingUser) {
        res.status(400);
        throw new Error("User with this email already exists");
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUserArray = await User.create(
      [
        {
          fullName,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    const user = newUserArray[0];

    //Generate token
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    }); 


    await session.commitTransaction();
    session.endSession();
    
    // set the cookie before sending the response
    res.cookie("token", token,{
        httpOnly: true,
        secure: config.NODE_ENV === "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days manually

    });

    res.status(201).json({ 
        success: true,
        message: "User registered successfully",
        data: {
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            }
        }
    });

  }catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }

};


// login user

const loginUser = async (req, res, next) => {
  try {
    const { email, password} = req.body;

    //validate input
    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    // find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    // compare the password
    const isPasswordValid= await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    // set the cookie before sending the response
    res.cookie("token", token,{
        httpOnly: true,
        secure: config.NODE_ENV === "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days manually

    });

    res.status(200).json({ 
        success: true,
        message: "User logged in successfully",
        data: {
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            }
        }
    });

  }catch (error) {
    next(error);
  } 
};

const logoutUser = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: config.NODE_ENV === "development",
      sameSite: "strict",
      expires: new Date(0), // Set the cookie to expire immediately
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });

  }catch (error) { 
    next(error);
    }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};