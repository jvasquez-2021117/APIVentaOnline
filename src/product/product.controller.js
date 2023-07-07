'use strict'

const Product = require('./product.model');
const Category = require('../category/category.model');
const { validateDataUpdate } = require('../utils/validate');

exports.test = (req, res)=>{
    res.send({message: 'test fuction is running'});
}

exports.add = async(req, res)=>{
    try{
        let data = req.body;
        let productExists = await Product.findOne({name: data.name});
        let categoryExists = await Category.findOne({_id: data.category});
        if(!categoryExists) return res.send({message: 'Category not found'});
        if(productExists) return res.send({message: 'Product already exists'});
        let product = new Product(data);
        await product.save();
        return res.status(201).send({message: 'Successfully added'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error adding data'});;
    }
}
exports.update = async(req, res)=>{
    try{
        let productId = req.params.id;
        let data = req.body;
        let msg = validateDataUpdate(data);
        if(msg) return res.status(400).send({message: msg});
        let updateProduct = await Product.findOneAndUpdate({_id: productId}, data, {new: true});
        if(!updateProduct) return res.status(400).send({message: 'Produt not found'});
        return res.status(200).send({message: 'Update product', updateProduct});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating data'});
    }
};

exports.delete = async(req, res)=>{
    try{
        let productId = req.params.id;
        let deleteProduct = await Product.findOneAndDelete({_id: productId});
        if(!deleteProduct) return res.status(400).send({message: 'Product not found and not deleted'});
        return res.status(200).send({message: `Product with name ${deleteProduct.name} deleted successfully`});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'error deleting product'});
    }
}

exports.getProducts = async(req, res)=>{
    try{
        let products = await Product.find();
        return res.status(200).send({products});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting products'});
    };
};

exports.searchProduct = async(req, res)=>{
    try{
        let data = req.body;
        let products = await Product.find({name: {$regex: data.name}});
        if(products.length == 0) return res.status(400).send({message: 'Products not found'});
        return res.status(200).send({products});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error search product'});
    }
}

exports.searchProductCategory = async(req, res)=>{
    try{
        let { category } = req.body;
        let products = await Product.find({category: category});
        if(products.length == 0) return res.status(400).send({message: 'Products not found'});
        return res.status(200).send({products});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error search product'});
    }
}

exports.SoldOut = async(req, res)=>{
    try{
        let products = await Product.find({stock: 0});
        return res.status(200).send({products});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting products'});
    }
}

exports.bestSellers = async(req, res)=>{
    try{
        let products = await Product.find({}, {name: 1, price: 1, _id: 0}).sort({sales: -1}).limit(3);
        return res.status(200).send({message: 'Mas vendidos', products});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting products'});
    }
}

