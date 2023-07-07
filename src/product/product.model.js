'use strict'

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        uniqued: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    sales: {
        type: Number,
        required:  true,
        default: 0
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Product', productSchema);