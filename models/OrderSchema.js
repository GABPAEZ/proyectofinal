import mongoose from 'mongoose';
import { Schema } from 'mongoose';


const orderSchema = new Schema({

    shippingInfo: {
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
            required: true
        },    
    },
    orderItems: [
            {
                name: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                image: {
                    type: String,
                    required: true,
                },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
            }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentMethods: {
        type: String,
        enum: ['ONLINE', 'COD'],
        default: 'COD'
    },
    paidAt: Date,
    paymentInfo: {
        id: String,
        Status: String
    },
    itemsPrice: {
        type: Number,
        required: true
    },
    taxPrice: {
        type: Number,
        required: true
    },
    shippingCharges: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['Preparing', 'Shipped', 'Delivered'],
        default: 'Preparing'
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now(),
    }

});

export const Order = mongoose.model('Order', orderSchema);
