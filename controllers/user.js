import express from 'express';
import { User } from '../models/user.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { getDataUri, sendEmail } from '../utils/features.js';
import cloudinary from 'cloudinary';

//==================================== LOGIN ===================================================//

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const emailLower = email.toLowerCase();

  const user = await User.findOne({ email: emailLower }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Correo electrónico no encontrado', 400));
  }

  if (!password)
    return next(new ErrorHandler('Por favor verifique el password', 400));
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
      secure: process.env.NODE_ENV === 'Development' ? false : true,
      httpOnly: process.env.NODE_ENV === 'Development' ? false : true,
      sameSite: process.env.NODE_ENV === 'Development' ? false : 'none',
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

  let avatar = undefined;

  if (req.file) {
    //req.file console.log(req.file);
    const file = getDataUri(req.file);
    //console.log( file );

    //cloudinary

    const myCloud = await cloudinary.uploader.upload(file.content);
    // console.log(myCloud.secure_url)
    avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  try {
    await User.create({
      avatar, // paso  al foto
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
    // console.log(error.message)
    next(new ErrorHandler('El correo se encuentra registrado', 400));
  }
};

//==================================== Mi PERFIL ===================================================//

export const getMyProfile = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
};

//==================================== LOGOUT ===================================================//

export const logOut = async (req, res, next) => {
  res
    .status(200)
    .cookie('token', '', {
      secure: process.env.NODE_ENV === 'Development' ? false : true,
      httpOnly: process.env.NODE_ENV === 'Development' ? false : true,
      sameSite: process.env.NODE_ENV === 'Development' ? false : 'none',
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: 'Ha salido del sistema',
    });
};

//==================================== UPDATE ===================================================//

export const updateProfile = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const {
    name,
    email,
    password,
    address,
    city,
    country,
    zipCode,
    role,
    avatar,
  } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;
  if (address) user.address = address;
  if (country) user.country = country;
  if (city) user.city = city;
  if (zipCode) user.zipCode = zipCode;
  if (role) user.role = role;
  if (avatar) user.avatar = avatar;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Usuario Actualizado Exitosamente!',
  });
};

export const changePassword = async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(new ErrorHandler('Por favor envie el password', 400));

  const isMatched = await user.comparePassword(oldPassword);

  if (!isMatched) {
    return next(new ErrorHandler('El password anterior es incorrecto', 400));
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Password Actualizado Exitosamente!',
  });
};

//==================================== Actualizar AVATAR ===================================================//

export const updatePic = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const file = getDataUri(req.file);
  await cloudinary.uploader.destroy(user.avatar.public_id);
  const myCloud = await cloudinary.uploader.upload(file.content);
  user.avatar = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  await user.save();
  res.status(200).json({
    success: true,
    message: 'El avatar fue actualizado correctamente',
  });
};

//==================================== OLVIDO CONTRASEÑA  ===================================================//

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler('Usuario no encontrado', 404));
  if (!email) return next(new ErrorHandler('Por favor ingrese el email', 404));

  const randomNumer = Math.random() * (999999 - 100000) + 100000;
  const OTP = Math.floor(randomNumer);
  const opt_expired = 15 * 60 * 1000;

  user.opt = OTP;
  user.opt_exp = new Date(Date.now() + opt_expired);

  await user.save();

  // console.log(user.opt);
  // console.log(user.opt_exp);

  //sendEmail()
  const message = `Su OTP para resetear su password es ${OTP}.\n Si Ud. no solicito el reset por favor ignore este mensaje`;

  try {
    await sendEmail('OTP para reset de password', user.email, message);
  } catch (error) {
    user.opt = null;
    user.opt_exp = null;
    await user.save();
    next(error);
  }

  res.status(200).json({
    success: true,
    message: `Email enviado a ${user.email} con código de seguridad para reestablecer la contraseña`,
  });
};

//==================================== RESET CONTRASEÑA  ===================================================//
//$gt operador de mongo

export const resetPassword = async (req, res, next) => {
  const { opt, password } = req.body;
  const user = await User.findOne({
    opt,
    opt_exp: { $gt: Date.now() },
  });

  if (!user)
    return next(new ErrorHandler('código OTP incorrecto o ha caducado', 400));
  if (!password)
    return next(new ErrorHandler('Por favor ingrese la nueva contraseña', 400));
  user.password = password;
  user.opt = undefined;
  user.opt_exp = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message:
      'El password ha sido actualizado correctamente, por favor inicie sesión nuevamente',
  });
};
