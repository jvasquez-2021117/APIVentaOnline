'use strict'

const express = require('express');
const { ensureAuth, isAdmin} = require('../service/authenticated');
const api = express.Router();
const productController = require('./product.controller');

api.get('/', productController.test);
api.post('/add', [ensureAuth, isAdmin],productController.add);
api.put('/update/:id', [ensureAuth, isAdmin],productController.update);
api.delete('/delete/:id', [ensureAuth, isAdmin], productController.delete);
api.get('/getProducts', ensureAuth,productController.getProducts);
api.post('/searchProduct', ensureAuth,productController.searchProduct);
api.post('/searchProductCategory', ensureAuth,productController.searchProductCategory);
api.get('/soldOut', [ensureAuth, isAdmin],productController.SoldOut);
api.get('/bestSellers', ensureAuth,productController.bestSellers);

module.exports = api;
