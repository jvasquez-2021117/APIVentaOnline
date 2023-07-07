"use strict";

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                subTotal_product: { type: Number, required: true },
                _id: false,
            },
        ],
        createdAt: { type: Date, default: Date.now },
        total: {
            type: Number,
            required: true,
        },
    },
    {
        versionKey: false,
    }
);

module.exports = mongoose.model("Cart", cartSchema);
