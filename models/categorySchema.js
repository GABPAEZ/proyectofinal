import mongoose from 'mongoose';
import { Schema } from 'mongoose';


const producSchema = new Schema({
    category: {
        type: String,
        required:[true, "Por favor proporcione uns categoría"],
    }
});

export default Category = mongoose.model('Category', productSchema);