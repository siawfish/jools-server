import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import config from '../config/index.js';
import { workerRouter, userRouter, adminRouter } from './routes/index.js';
import cloudinaryConfig from '../config/cloudinary.js';
import typesense, { typesenseWorkerSchema } from '../config/typesense.js';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js';
import { CollectionSchema } from 'typesense/lib/Typesense/Collection.js';

const app = express();
const schema = typesenseWorkerSchema as CollectionCreateSchema;

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

typesense.collections().retrieve().then((collections: CollectionSchema[]) => {
    const workerCollectionExists = collections.some(collection => collection['name'] === 'workers');

    if (!workerCollectionExists) {
        typesense.collections().create(schema).then(() => {
            console.log('Worker schema created');
        }).catch((error: any) => {
            console.log(error?.message);
        });
        return;
    }

    console.log('Worker collection exists');
}).catch((error: any) => {
    console.log(error?.message);
});

// workers routes
app.use('/api/workers/auth', workerRouter.workersAuthRoutes);
app.use('/api/workers', workerRouter.workersProfileRoutes);
app.use('/api/workers', workerRouter.workersPortfolioRoutes);
app.use('/api/workers', workerRouter.workersFilesRoutes);
app.use('/api/workers', workerRouter.workersSkillsRoutes);

// users routes
app.use('/api/users/auth', userRouter.usersAuthRoutes);
app.use('/api/users', userRouter.usersFilesRoutes);
app.use('/api/users', userRouter.usersProfileRoutes);
app.use('/api/users', userRouter.usersBookingRoutes);
app.use('/api/users', userRouter.usersSkillsRoutes);
app.use('/api/users', userRouter.searchRoutes);

// admin routes
app.use('/api/admin/auth', adminRouter.adminAuthRoutes);
app.use('/api/admin', adminRouter.adminProfileRoutes);
app.use('/api/admin', adminRouter.adminSkillsRoutes);
app.use('/api/admin', adminRouter.adminWorkersRoutes);


app.listen(config.port, ()=>console.log(`App is listening on url ${config.host}:${config.port}`));
