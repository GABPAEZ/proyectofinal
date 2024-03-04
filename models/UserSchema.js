import mongoose from 'mongoose';
import validator from 'validator';
import { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

//Previo a guardar en la bbdd hash el password

userSchema.pre('save', async function () {
  const temp = await bcrypt.hash(this.password, 10);
  this.password = temp;
});

//Metodo para comparar los password con el nombre comparePassword

userSchema.methods.comparePassword = async function (passwordEntered) {
  return await bcrypt.compare(passwordEntered, this.password);
};

// funcion para generar el token de 30 minutos(1800s) 2d 2 dias

userSchema.methods.generateToken =  function () {
  return  jwt.sign({ _id: this._id }, process.env.SECRET_JWT, {
    expiresIn: '2d',
  });
};

//paso a miniscula el correo por si escriben con mayusculas

userSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

export const User = mongoose.model('User', userSchema);
