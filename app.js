require('dotenv').config();
require('express-async-errors')
const express = require('express');
const app = express();

//packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');


//routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoute');
const jobRouter = require('./routes/jobRoute');
const appliedJobRouter = require('./routes/appliedJobRoute')

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(fileUpload());

//ROutes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/jobs-application', appliedJobRouter);


//Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//database
const connectDB = require('./db/connect');



const port = process.env.PORT || 5000;

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`server listening on port ${port}`);
        });
    }catch(error){
        console.log(error)
    }
};

start();
