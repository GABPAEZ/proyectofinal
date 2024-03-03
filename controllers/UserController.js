import express from 'express';
import { User } from '../models/UserSchema.js';

export const login = (req, res, next) => {
  res.send('login');
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
