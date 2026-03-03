const config = require("../config/env")

const errorHandler = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    
    console.error(err);
    
    // Mongoose bad ObjectId
    if (err.name === "CastError") {
      const message = `Resource not found with id of ${err.value}`;
      error = new Error(message);
      res.status(404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      res.status(400);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
      error = new Error(message);
      res.status(400);
    }
    
    const statusCode =
      res.statusCode && res.statusCode !== 200
        ? res.statusCode
        : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
      stackTrace:
        config.NODE_ENV === "development"
          ? error.stack
          : null,
    });


  }catch (error) {
    next(error);
  }
};


module.exports = errorHandler;



