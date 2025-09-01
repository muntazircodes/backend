import moment from 'moment';
import { BadRequestError, NotFoundError } from '@hyperflake/http-errors';
import { IUser, User } from '../models/index';
import { ObjectId, sanitizeObject } from '../utils';

class UserService {
    async getAllUsers() {
        const users = await User.find();

        return users;
    }

    async createUser(params: { payload: Pick<IUser, 'name' | 'email' | 'username' | 'password' | 'role' | 'status'> }) {
        const { payload } = params;

        const existsByUsername = await User.exists({ username: { $regex: payload.username, $options: 'i' } });

        if (existsByUsername) throw new BadRequestError(`A user with username ${payload.username} already exists.`);

        const existsByEmail = await User.exists({ email: { $regex: payload.email, $options: 'i' } });

        if (existsByEmail) throw new BadRequestError(`A user with email ${payload.email} already exists`);

        const user = await User.create(payload);

        return user;
    }

    async getUser(params: { userId: string }) {
        const { userId } = params;

        const user = await this.getUserOrThrowError({ userId: userId });

        return user;
    }

    async updateUser(params: { userId: string; payload: Partial<IUser> }) {
        const { userId } = params;
        let { payload } = params;

        payload = sanitizeObject(payload, ['name', 'email', 'username', 'password', 'role', 'status']);

        const user = await this.getUserOrThrowError({
            userId: userId,
        });

        if (payload.username) {
            const existsByUsername = await User.exists({
                _id: { $ne: new ObjectId(userId) },
                username: { $regex: payload.username, $options: 'i' },
            });

            if (existsByUsername) throw new BadRequestError(`A user with username ${payload.username} already exists.`);
        }

        if (payload.email) {
            const existsByEmail = await User.exists({
                _id: { $ne: new ObjectId(userId) },
                email: { $regex: payload.email, $options: 'i' },
            });

            if (existsByEmail) throw new BadRequestError(`A user with email ${payload.email} already exists`);
        }

        Object.keys(payload).forEach((k) => {
            (user as any)[k] = payload[k as keyof IUser];
        });

        await user.save();

        return user;
    }

    async deleteUser(params: { userId: string }) {
        const { userId } = params;

        const user = await this.getUserOrThrowError({
            userId: userId,
        });

        user.email = `${user._id.toString()}@<application-domain>.io`;
        user.username = user._id.toString();
        user.deletedOn = moment().toDate();

        await user.save();

        return { _id: user._id };
    }

    private async getUserOrThrowError(params: { userId: string }) {
        const { userId } = params;

        const user = await User.findOne({ _id: new ObjectId(userId), deletedOn: null });

        if (!user) throw new NotFoundError(`User with id ${userId} not found.`);

        return user;
    }
}

export const userService = new UserService();
