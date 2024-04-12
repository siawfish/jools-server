import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import path from 'path';

import config from '../config/index.js';
import routes from './routes/index.js';
import { clientErrorHandler, errorHandler, logErrors } from './helpers/errorHandlers.js';

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

app.use('/api/workers/auth', routes.workersAuthRoutes);


app.listen(config.port, ()=>console.log(`App is listening on url ${config.host}:${config.port}`));
