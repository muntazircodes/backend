import { Request, Response, Router } from 'express';
import { authService } from '../services/auth.service';
import { tokenService } from '../services/token.service';

const router = Router();

/**
 *  @method             POST
 *  @description        Authenticate using username/email and password
 *  @access             public
 */
router.post('/authenticate', async (req: Request, res: Response) => {
    const { usernameOrEmail, password } = req.body;

    const user = await authService.findByCredentials(usernameOrEmail, password);

    const { token } = await tokenService.generateToken({ _id: user._id, username: user.username });

    res.send({ token });
});

export default router;
