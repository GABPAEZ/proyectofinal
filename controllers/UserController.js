import express from 'express';
import { User } from '../models/UserSchema.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';

//==================================== LOGIN ===================================================//

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const emailLower = email.toLowerCase();

  const user = await User.findOne({ email: emailLower }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Correo electrónico no encontrado', 400));
  }
  // si pasa y encuentra el email verifico el pass

  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    return next(new ErrorHandler('El password es incorrecto', 400));
  }

  // si todo sale bien responde y envia el token y la guarda en la cookie del usuaio por 7 dias

  const access_token = user.generateToken();

  res
    .status(200)
    .cookie('token', access_token, {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    })
    .json({
      success: true,
      message: `Bienvenido de nuevo ${user.name}`,
      access_token,
    });
};

//==================================== REGISTER ===================================================//

export const signup = async (req, res, next) => {
  // res.send('register');

  const { name, email, password, address, country, city, zipCode } = req.body;

  try {
    await User.create({
      name,
      email,
      password,
      address,
      country,
      city,
      zipCode,
    });

    next(new ErrorHandler('Usuario registrado con exito', 201));
  } catch (error) {
    next(new ErrorHandler('El correo se encuentra registrado', 400));
  }
};



//==================================== Mi PERFIL ===================================================//

