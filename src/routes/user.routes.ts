import { Request, Response, Router } from 'express';
import { userAuth } from '../middlewares/auth.middleware';
import { userService } from '../services/user.service';

const router = Router();

/**
 *  @method             GET
 *  @description        Get all users
 *  @access             private
 */
router.get('/', [userAuth], async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();

    res.send(users);
});

/**
 *  @method             POST
 *  @description        Create new user
 *  @access             private
 */
router.post('/', [userAuth], async (req: Request, res: Response) => {
    const { name, email, username, password, role, status } = req.body;

    const user = await userService.createUser({
        payload: { name, email, username, password, role, status },
    });

    res.send(user);
});

/**
 *  @method             GET
 *  @description        Get user by id
 *  @access             private
 */
router.get('/:userId', [userAuth], async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await userService.getUser({ userId });

    res.send(user);
});

/**
 *  @method             PATCH
 *  @description        Update user
 *  @access             private
 */
router.patch('/:userId', [userAuth], async (req: Request, res: Response) => {
    const { userId } = req.params;

    const { name, email, username, password, role, status } = req.body;

    const user = await userService.updateUser({
        userId,
        payload: { name, email, username, password, role, status },
    });

    res.send(user);
});

/**
 *  @method             DELETE
 *  @description        Delete user
 *  @access             private
 */
router.delete('/:userId', [userAuth], async (req: Request, res: Response) => {
    const { userId } = req.params;

    const result = await userService.deleteUser({ userId });

    res.send(result);
});

export default router;
