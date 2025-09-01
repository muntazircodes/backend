import { NextFunction, Request, Response } from 'express';
import { authStorage } from '../configuration/auth-storage.config';
import { UnauthorizedError } from '@hyperflake/http-errors';
import { authService } from '../services/auth.service';
import { tokenService } from '../services/token.service';

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('authorization');

    // Extract token from authorization header
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) throw new UnauthorizedError(`Unauthorized Access.`);

    try {
        const payload = await tokenService.validateToken(token);

        const user = await authService.findById(payload._id);

        authStorage.run({ user: user.toObject() }, () => {
            next();
        });
    } catch (err) {
        next(err);
    }
};
