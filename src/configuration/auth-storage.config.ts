import { AsyncLocalStorage } from 'async_hooks';
import { IAuthUser } from '../interfaces';

class AuthStorage extends AsyncLocalStorage<{
    user: IAuthUser;
}> {
    getAuthUser() {
        return this.getStore()?.user;
    }
}

export const authStorage = new AuthStorage();
