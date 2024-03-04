import express from 'express';
import { User } from '../models/UserSchema.js';
import cookie from 'cookie-parser';

//==================================== LOGIN ===================================================//

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const emailLower = email.toLowerCase();

  const user = await User.findOne({ email: emailLower }).select('+password');

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Correo electrónico no encontrado',
    });
  }
  // si pasa y encuentra el email verifico el pass

  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    return res.status(400).json({
      success: false,
      message: 'Password incorrecto!',
    });
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

    res.status(201).json({
      success: true,
      message: 'Usuario registrado con exito',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'El correo se encuentra registrado',
      
    });
  }
};
