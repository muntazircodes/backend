import sinon from 'sinon';
import { authService } from '../../../services/auth.service';
import { User } from '../../../models';
import { BadRequestError, UnauthorizedError } from '@hyperflake/http-errors';

describe('AuthService', () => {
    describe('findByCredentials', () => {
        let findOneUserStub: sinon.SinonStub;

        beforeEach(() => {
            findOneUserStub = sinon.stub(User, 'findOne');
        });

        it('should return user object when passed correct username and password', async () => {
            const dummyUser = {
                email: 'validEmail@example.com',
                username: 'validUsername',
                password: 'validPassword@123',
                status: 'ENABLED',
            };

            findOneUserStub.resolves(dummyUser);

            await expect(authService.findByCredentials(dummyUser.username, dummyUser.password)).resolves.toEqual(
                dummyUser
            );
        });

        it('should throw error when username or password are not provided', async () => {
            await expect(authService.findByCredentials('', 'validPass')).rejects.toThrow('Invalid credentials.');
            await expect(authService.findByCredentials('validUser', '')).rejects.toThrow('Invalid credentials.');
        });

        it('should throw an error if no user is found', async () => {
            findOneUserStub.resolves(null);

            await expect(authService.findByCredentials('nonexistentUser', 'anyPassword')).rejects.toThrow(
                'Invalid credentials.'
            );
        });

        it('should throw an error if the password is incorrect', async () => {
            const dummyUser = { username: 'validUser', password: 'validPass', status: 'ACTIVE' };

            findOneUserStub.resolves(dummyUser);

            await expect(authService.findByCredentials(dummyUser.username, 'wrongPassword')).rejects.toThrow(
                'Invalid credentials.'
            );
        });

        it('should throw an error if the user account is disabled', async () => {
            const dummyUser = { username: 'validUser', password: 'validPass', status: 'DISABLED' };

            findOneUserStub.resolves(dummyUser);

            await expect(authService.findByCredentials(dummyUser.username, dummyUser.password)).rejects.toThrow(
                'Your account has been disabled.'
            );
        });
    });

    describe('findById', () => {
        let findOneUserStub: sinon.SinonStub;

        beforeEach(() => {
            findOneUserStub = sinon.stub(User, 'findOne');
        });

        it('should throw UnauthorizedError when no user is found', async () => {
            findOneUserStub.resolves(null);

            await expect(authService.findById('507f191e810c19729de860ea')).rejects.toThrow(UnauthorizedError);
        });

        it('should throw BadRequestError when the account is disabled', async () => {
            findOneUserStub.resolves({ status: 'DISABLED' });

            await expect(authService.findById('507f191e810c19729de860ea')).rejects.toThrow(BadRequestError);
        });

        it('should return the user object when the user is found and the account is enabled', async () => {
            const user = { status: 'ENABLED' };

            findOneUserStub.resolves(user);

            await expect(authService.findById('507f191e810c19729de860ea')).resolves.toEqual(user);
        });
    });
});
