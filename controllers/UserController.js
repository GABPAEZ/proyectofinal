import express from 'express';
import { User } from '../models/UserSchema.js';

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

  res.status(200).json({
    success: true,
    message: `Bienvenido de nuevo ${user.name}`,
  });
};

export const signup = async (req, res, next) => {
  // res.send('register');

  const { name, email, password, address, country, city, zipCode } = req.body;

  await User.create({ name, email, password, address, country, city, zipCode });

  res.status(201).json({
    success: true,
    message: 'Usuario registrado con exito',
  });
};
