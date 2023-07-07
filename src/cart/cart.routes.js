'use strict'

const express = require('express');
const api = express.Router();
const cartController = require('./cart.controller');
const { ensureAuth, isAdmin } = require('../service/authenticated');

api.get('/', cartController.test);
api.post('/addProduct', ensureAuth,cartController.addProductsInCart);
api.get('/getMyCart', ensureAuth, cartController.getMyCart);
api.put('/updateCart', ensureAuth, cartController.updateCart)

module.exports = api;