import express from 'express';
import {
  getMyProfile,
  logOut,
  login,
  signup,
} from '../controllers/UserController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const userRouter = express.Router();

//userRouter.route('/login').post(login);
//userRouter.route('/register').post(signup);
//userRouter.route('/me').get(isAuthenticated, getMyProfile);

userRouter.post('/login', login);
userRouter.post('/register', signup);
userRouter.get('/me', isAuthenticated, getMyProfile);
userRouter.get('/logout', isAuthenticated, logOut);

export default userRouter;
