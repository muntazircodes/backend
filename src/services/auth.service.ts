import { UserStatusEnum } from '../enums';
import { BadRequestError, UnauthorizedError } from '@hyperflake/http-errors';
import { User } from '../models';
import { ObjectId } from '../utils';

class AuthService {
    async findByCredentials(usernameOrEmail: string, password: string) {
        if (!(usernameOrEmail && password)) throw new BadRequestError('Invalid credentials.');

        const user = await User.findOne({
            $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
            deletedOn: null,
        });

        if (!user) throw new BadRequestError('Invalid credentials.');

        const isValidPassword = user.password === password;

        if (!isValidPassword) throw new BadRequestError('Invalid credentials.');

        if (user.status === UserStatusEnum.DISABLED) throw new BadRequestError('Your account has been disabled.');

        return user;
    }

    async findById(_id: string) {
        const user = await User.findOne({ _id: new ObjectId(_id), deletedOn: null });

        if (!user) throw new UnauthorizedError(`Unauthorized Access.`);

        if (user.status === UserStatusEnum.DISABLED) throw new BadRequestError('Your account has been disabled.');

        return user;
    }
}

export const authService = new AuthService();
