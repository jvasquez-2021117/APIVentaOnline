'use strict'

const express = require('express');
const api = express.Router();
const categoryController = require('./category.controller');
const { ensureAuth, isAdmin } = require('../service/authenticated');

api.get('/', categoryController.test);
api.post('/add', [ensureAuth, isAdmin], categoryController.add);
api.put('/update/:id', [ensureAuth, isAdmin], categoryController.update);
api.delete('/delete/:id', [ensureAuth, isAdmin], categoryController.delete);
api.get('/getCategories', ensureAuth, categoryController.getCategories);
api.get('/getCategory', ensureAuth, categoryController.getCategory);

module.exports = api;
