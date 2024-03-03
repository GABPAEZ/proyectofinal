import moongose from 'moongose';
import { Schema } from 'moongose';

const orderSchema = new Schema({});

export default Order = moongose.model('Order', orderSchema);
