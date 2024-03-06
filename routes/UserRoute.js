import express from 'express';
import {
  changePassword,
  forgotPassword,
  getMyProfile,
  logOut,
  login,
  resetPassword,
  signup,
  updatePic,
  updateProfile,
} from '../controllers/UserController.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';

const userRouter = express.Router();

//userRouter.route('/login').post(login);
//userRouter.route('/register').post(signup);
//userRouter.route('/me').get(isAuthenticated, getMyProfile);

userRouter.post('/login', login);
userRouter.post('/register', singleUpload, signup);
userRouter.get('/me', isAuthenticated, getMyProfile);
userRouter.get('/logout', isAuthenticated, logOut);

userRouter.put('/updateprofile', isAuthenticated, updateProfile);
userRouter.put('/updatepassword', isAuthenticated, changePassword);
userRouter.put('/updatepic', isAuthenticated, singleUpload, updatePic);

userRouter.route('/forgotPassword').post(forgotPassword).put(resetPassword);

//olvido el password y resetear el password



export default userRouter;
