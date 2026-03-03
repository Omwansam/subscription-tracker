const express = require('express');
const cookieParser = require('cookie-parser');
const config = require("./config/env")
const connectDB = require("./database/mongodb");
const errorHandler = require('./middleware/errorHandler');


const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const subscriptionRouter = require('./routes/subscription.routes');


const app = express();

// Connect Database
connectDB();

//middleware parse to pass data to the server side
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = config.PORT;

app.get('/', (req, res) => {
  res.send('Hello Backend Working!');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/subscription', subscriptionRouter);

//Error HandlerMiddleware must be last
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});