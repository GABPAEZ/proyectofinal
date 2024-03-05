import { User } from '../models/UserSchema.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import jwt from 'jsonwebtoken';
import { asyncError } from './error.js';

export const isAuthenticated = asyncError(async (req, res, next) => {
  const { token } = req.cookies;
  //console.log('Cookie: ', token)
  if (!token) return next(new ErrorHandler('No se encuentra logueado', 401));
  const decodeData = jwt.verify(token, process.env.SECRET_JWT);
  req.user = await User.findById(decodeData._id);
  next();
});

export const isAdmin = asyncError(async (req, res, next) => {
  if (req.user.role !== 'admin')
    return next(new ErrorHandler('Solo el administrador tiene acceso', 401));
  next();
});
