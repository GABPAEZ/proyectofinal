import express from 'express';
import { login, signup } from '../controllers/UserController.js';

const userRouter = express.Router();

userRouter.route('/login').post(login);
userRouter.route('/register').post(signup);

export default userRouter;
