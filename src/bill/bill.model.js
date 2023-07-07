'use strict'

const mongoose = require('mongoose');

const billSchema =  mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required:  true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    nit: {
        type: String,
        required: true,
        default: 'CF'
    },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: {type: String, required: true},
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            subTotal_product: {type: Number, required: true},
            _id: false
        }
    ],
    total:{
        type: Number,
        required: true
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Bill', billSchema)