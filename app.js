import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import errorHandler from './middlewares/errorHandler.js';
import globalRoutes from './routes/index.routes.js';


const startApp = async () => {
    const app = express();

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 204
    }));

    app.use(helmet());
    app.use(morgan('dev'));

    app.use('/', globalRoutes);
    app.use(errorHandler);

    return app;
}


export default startApp;
