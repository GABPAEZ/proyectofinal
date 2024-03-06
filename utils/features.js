import DataUriParser from 'datauri/parser.js';
import path from 'path';
import { createTransport } from 'nodemailer';

export const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);

  //const meta = datauri(file);

  //   console.log(meta.content); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  //   console.log(meta.mimetype); //=> "image/png"
  //   console.log(meta.base64); //=> "iVBORw0KGgoAAAANSUhEUgAA..."
  // console.log(meta.buffer); //=> file buffer
};

export const sendEmail = async (subject, to, text) => {
  const transporter = createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  await transporter.sendMail({ subject, to, text });
};
