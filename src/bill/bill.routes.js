'use strict'

const billController = require('./bill.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth } = require('../service/authenticated');

api.get('/', billController.test);
api.post('/create', ensureAuth,billController.createBill);
api.put('/update/:id', ensureAuth, billController.update);
api.get('/myBills', ensureAuth, billController.getMyBills);
api.get('/getBill/:id', ensureAuth, billController.getBill);

module.exports = api;