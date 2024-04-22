import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import config from '../config/index.js';
import routes from './routes/index.js';
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

app.use('/api/workers/auth', routes.workersAuthRoutes);
app.use('/api/workers', routes.workersProfileRoutes);
app.use('/api/workers', routes.workersPortfolioRoutes);
app.use('/api/workers', routes.workersFilesRoutes);


app.listen(config.port, ()=>console.log(`App is listening on url ${config.host}:${config.port}`));
