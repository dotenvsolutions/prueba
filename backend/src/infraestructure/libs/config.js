import express from 'express';
import params  from './params';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors'
import authRoutes from '../routes/users.routes'

export default app => {
    app.set('port', process.env.SERVER_PORT || params.port);
    
     
    app.use(morgan('dev'));
    app.use(express.json({ limit: '500mb' }));
    app.use(helmet())
    app.use(cors())
    app.use('/api/auth', authRoutes)
    return app;
}