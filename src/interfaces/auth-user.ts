import { UserRoleEnum, UserStatusEnum } from '../enums';

export interface IAuthUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    role: UserRoleEnum;
    status: UserStatusEnum;
}
