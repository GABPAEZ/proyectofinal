import mongoose from 'mongoose';
import { Schema } from 'mongoose';


const categorySchema = new Schema({
    category: {
        type: String,
        required:[true, "Por favor proporcione uns categoría"],
    }
});

export const Category = mongoose.model('Category', categorySchema);