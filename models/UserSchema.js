import mongoose from 'mongoose';
import validator from 'validator';
import { Schema } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Por favor escriba su nombre'],
  },
  email: {
    type: String,
    required: [true, 'Por favor escriba un email'],
    unique: [true, 'El email ya se encuentra registrado'],
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, 'Por favor escriba su contraseña'],
    minLength: [6, 'Minimo cantidad de caracteres 6'],
    select: false,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  zipCode: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  avatar: {
    public_id: String,
    url: String,
  },
  opt: Number,
  opt_exp: Date,
});

export const User = mongoose.model('User', userSchema);
