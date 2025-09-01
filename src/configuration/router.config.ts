import { Express } from 'express';
import userRoutes from '../routes/user.routes';

export const init = (app: Express) => {
    app.use('/api/users', userRoutes);
};
