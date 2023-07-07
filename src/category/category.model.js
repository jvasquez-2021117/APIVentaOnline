'use strict'

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Category', categorySchema);