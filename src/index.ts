import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import config from '../config/index.js';
import { workerRouter, userRouter } from './routes/index.js';
import cloudinaryConfig from '../config/cloudinary.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Express file upload
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: path.join(__dirname, 'temp'),
        createParentPath: true
    })
);

cloudinaryConfig();

// workers routes
app.use('/api/workers/auth', workerRouter.workersAuthRoutes);
app.use('/api/workers', workerRouter.workersProfileRoutes);
app.use('/api/workers', workerRouter.workersPortfolioRoutes);
app.use('/api/workers', workerRouter.workersFilesRoutes);

// users routes
app.use('/api/users/auth', userRouter.usersAuthRoutes);
app.use('/api/users', userRouter.usersFilesRoutes);
app.use('/api/users', userRouter.usersProfileRoutes);
app.use('/api/users', userRouter.usersBookingRoutes);


app.listen(config.port, ()=>console.log(`App is listening on url ${config.host}:${config.port}`));
