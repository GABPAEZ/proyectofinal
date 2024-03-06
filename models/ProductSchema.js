import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Por favor proporcione un nombre'],
  },
  description: {
    type: String,
    required: [true, 'Por favor proporcione una descripcion'],
  },
  price: {
    type: Number,
    required: [true, 'Por favor proporcione un precio'],
  },
  stock: {
    type: Number,
    required: [true, 'Por favor proporcione un stock'],
  }, //no obligatorios los siguentes, si se envian se guardan, caso contrario no.
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});

export const Product = mongoose.model('Product', productSchema);
