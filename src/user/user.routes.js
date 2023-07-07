'use strict'

const userController = require('./user.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../service/authenticated');

api.get('/', userController.test);
api.post('/register', userController.register);
api.post('/save', [ensureAuth, isAdmin], userController.save);
api.post('/login', userController.login);
api.put('/update/:id', ensureAuth, userController.update);
api.delete('/delete/:id', ensureAuth, userController.delete);
api.get('/getUsers', [ensureAuth, isAdmin], userController.getUsers);
api.get('/getUser', [ensureAuth, isAdmin], userController.getUser);
api.delete('/deleteClient/:id', [ensureAuth, isAdmin], userController.deleteClient);
api.put('/updateClient/:id', [ensureAuth, isAdmin], userController.updateClient);

module.exports = api;