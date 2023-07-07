'use strict'

const Cart = require('./cart.model');
const Product = require('../product/product.model');

exports.test = (req, res)=>{
    return res.send({message: 'test fuction is running'});
}

exports.addProductsInCart = async(req, res)=>{
    try{
        let { productId, quantity } = req.body;
        let userId = req.user.sub;
        
        let cart = await Cart.findOne({user: userId});
        let product = await Product.findOne({_id: productId});
        if(quantity == '' || !quantity) quantity = 1;
        if(product.stock < quantity) return res.send({message: `There are not enough products for your requirement, we only have in stock ${product.stock}`});
        if(quantity == 0) return res.send({message: 'Enter a number greater than 0'});
        if(cart){
            let itemIndex = cart.products.findIndex(p=> p.product == productId);
            if(itemIndex > -1){
                let productItem = cart.products[itemIndex];
                productItem.quantity += parseInt(quantity);
                if(product.stock < productItem.quantity) return res.send({message: `There are not enough products for your requirement, we only have in stock ${product.stock}`});
                productItem.subTotal_product = product.price*productItem.quantity;
                cart.products[itemIndex] = productItem;
            }else{
                cart.products.push({product: productId, name: product.name, quantity, price: product.price, subTotal_product: product.price*parseInt(quantity) });
            }
            cart.total = 0;
            for(let product of cart.products){
                cart.total += product.subTotal_product;
            }

            cart = await cart.save();
            return res.status(200).send(cart);
        }else{
            //let newCart = new Cart({user: userId, products: [{product: data, price: product.price}]});
            let newCart = await Cart.create({user: userId, products: [{product: productId, name: product.name, quantity, price: product.price, subTotal_product: product.price*parseInt(quantity)}], total: product.price*quantity});
            let cart = await Cart.findOne({user: userId});
            return res.status(201).send({newCart});
        }
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error adding product in cart'});
    }
}

exports.updateCart = async(req, res)=>{
    try{
        let { productId, quantity } = req.body;
        let userId = req.user.sub;
        let cart = await Cart.findOne({user: userId});
        let product = await Product.findOne({_id: productId});
        if(!cart) return res.send({message: 'Your cart is empty'});
        let itemIndex = cart.products.findIndex(p=> p.product == productId);
            if(itemIndex > -1){
                let productItem = cart.products[itemIndex];
                if(quantity == 0) {
                    cart.products.splice(itemIndex);
                }else{
                productItem.quantity = parseInt(quantity);
                if(product.stock < productItem.quantity) return res.send({message: `There are not enough products for your requirement, we only have in stock ${product.stock}`});
                productItem.subTotal_product = product.price*productItem.quantity;
                cart.products[itemIndex] = productItem;
                }
            }else {
                return res.send({message: 'This product is not in the cart'});
            }
            cart.total = 0;
            for(let product of cart.products){
                cart.total += product.subTotal_product;
            }
            let updateCart = await Cart.findOneAndUpdate({user: userId}, cart, {new: true});
            return res.status(200).send({updateCart});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating cart'});
    }
};

exports.getMyCart = async(req, res)=>{
    try{
        let userId = req.user.sub;
        let cart = await Cart.findOne({user: userId}, {_id:0 ,user: 0, products: {product: 0}});
        if(!cart || cart.products.length == 0) return res.send({message: 'Your cart is empty'});
        return res.status(200).send({cart});
    }catch(err){
        console.error(err);
        res.status(500).send({message: 'Error getting cart'});
    }
}

exports.getCars = async(req, res)=>{
    try{
        let carts = await Cart.find();
        return res.status(200).send({carts})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting carts'});
    }

}