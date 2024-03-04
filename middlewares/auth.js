import { User } from '../models/UserSchema.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  //console.log('Cookie: ', token)
  if (!token) return next(new ErrorHandler('No se encuentra logueado', 401));
  const decodeData = jwt.verify(token, process.env.SECRET_JWT);
  req.user = await User.findById(decodeData._id);
  next();
};
