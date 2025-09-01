import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import { UnauthorizedError } from '@hyperflake/http-errors';
import { tokenService } from '../../../services/token.service';

describe('TokenService', () => {
    describe('generateToken', () => {
        it('should generate a token successfully', async () => {
            const mockToken = 'dummy_token';

            sinon.stub(jwt, 'sign').yields(null, mockToken);

            await expect(tokenService.generateToken({ _id: '12345' })).resolves.toEqual({ token: mockToken });
        });
    });

    describe('validateToken', () => {
        it('should validate a token and return payload', async () => {
            const mockData = { _id: '1234' };

            sinon.stub(jwt, 'verify').yields(null, mockData);

            await expect(tokenService.validateToken('valid_token')).resolves.toEqual(mockData);
        });

        it('should throw an error if the token passed is invalid', async () => {
            sinon.stub(jwt, 'verify').throws(new UnauthorizedError('Invalid Token'));

            await expect(tokenService.validateToken('tampered_jwt_token')).rejects.toThrow(UnauthorizedError);
        });
    });
});
