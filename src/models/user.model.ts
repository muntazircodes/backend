import { HydratedDocument, Model, Schema, model, Types } from 'mongoose';
import { UserRoleEnum, UserStatusEnum } from '../enums/index';

const collectionName = 'User';

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    username: string;
    password: string;
    role: UserRoleEnum;
    status: UserStatusEnum;
    deletedOn?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserMethods {}

export interface UserModel extends Model<IUser, {}, IUserMethods> {}

export const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            index: true,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            index: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(UserStatusEnum),
            default: UserStatusEnum.ENABLED,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(UserRoleEnum),
            required: true,
        },
        deletedOn: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        minimize: false,
        collection: collectionName,
        toJSON: { getters: true, virtuals: true },
        toObject: { getters: true, virtuals: true, minimize: false },
    }
);

UserSchema.methods.toJSON = function () {
    const userCopy = { ...this.toObject() };

    delete userCopy.password;
    delete userCopy.deletedOn;

    return userCopy;
};

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

export const User = model<IUser, UserModel>(collectionName, UserSchema);
