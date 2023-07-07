'use strict'

require('dotenv').config();

const mongoConfig = require('./configs/mongo');
const app = require('./configs/app');
const categoryController = require('./src/category/category.controller');
const userController = require('./src/user/user.controller');

mongoConfig.connect();
app.initServer();
categoryController.defaultCategory();
userController.createSupremeAdmin();