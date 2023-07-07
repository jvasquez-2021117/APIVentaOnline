'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 2651;
const userRoutes = require('../src/user/user.routes');
const categoryRoutes = require('../src/category/category.routes');
const productRoutes = require('../src/product/product.routes');
const cartRoutes = require('../src/cart/cart.routes');
const billRoutes = require('../src/bill/bill.routes');

const { Router } = require('express');

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/bill', billRoutes);

exports.initServer = ()=> {
    app.listen(port);
    console.log(`Server http running in port ${port}`);
}
