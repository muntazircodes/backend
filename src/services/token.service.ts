import jwt from 'jsonwebtoken';
import { BadRequestError, UnauthorizedError } from '@hyperflake/http-errors';

class TokenService {
    private secret: string;

    constructor() {
        this.secret = process.env.JWT_SECRET!;
    }

    async generateToken(data: any, options: { expiresIn?: number } = {}): Promise<{ token: string }> {
        const { expiresIn = 30 * 24 * 60 * 60 } = options;

        return new Promise((resolve, reject) => {
            jwt.sign(data, this.secret, { expiresIn }, (err, token) => {
                if (err) {
                    console.log(err);
                    return reject(new BadRequestError(err.message));
                }

                resolve({ token: token! });
            });
        });
    }

    async validateToken(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, (err, decoded) => {
                if (err) {
                    console.log(err);
                    return reject(new UnauthorizedError('Invalid Token'));
                }

                resolve(decoded);
            });
        });
    }
}

export const tokenService = new TokenService();
