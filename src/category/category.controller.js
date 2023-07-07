'use strict'

const Category = require('./category.model');
const { validateData } = require('../utils/validate');
const Product = require('../product/product.model');

exports.test = (req, res)=>{
    return res.send({message: 'Test fuction is running'});
}

exports.defaultCategory = async(req, res)=>{
    try{
        let defualt = {
            name: 'Default',
            code: '11111',
            description: 'Default category'
        }
        let exist = await Category.findOne({name: 'Default'});
        if(exist) return console.log('Default category already created');
        let create = new Category(defualt);
        await create.save();
        return console.log('Default category created successfully');
    }catch(err){
        console.error(err);
        return  console.log('Error adding default category');
    }
}


exports.add = async(req, res)=>{
    try{
        let data = req.body;
        let credentials = {
            name: data.name,
            code: data.code
        }
        let msg = validateData(credentials);
        if(msg) return res.status(400).send({msg});
        let category = new Category(data);
        await category.save();
        return res.status(201).send({message: 'Category save sucessfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error adding', Error: err.message});

    }
}

exports.update = async(req, res)=>{
    try{
        let categoryId = req.params.id
        let data = req.body;
        let existCategory = await Category.findOne({name: data.name});
        if(existCategory){
            if(existCategory._id != categoryId) return res.send({message: 'Category already exist'});
            let updateCategory = await Category.findOneAndUpdate({_id: categoryId}, data, {new: true});
            if(!updateCategory) return res.send({message: 'Category not found and not update'});
            return res.send({updateCategory});
        }
        let updateCategory = await Category.findOneAndUpdate({_id: categoryId}, data, {new: true});
        if(!updateCategory) return res.send({message: 'Category not found and not update'});
        return res.status(200).send({updateCategory});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating category'});
    }
}

exports.delete = async(req, res)=>{
    try{
        let categoryId = req.params.id;
        let defaulCategory = await Category.findOne({name: 'Default'});
        if(defaulCategory._id == categoryId) return res.send({message: 'Default category cannot deleted'});
        await Product.updateMany({category: categoryId}, {category: defaulCategory._id});
        let deletedCategory = await Category.findByIdAndDelete({_id: categoryId});
        if(!deletedCategory) return res.send({message: 'Category not found and not deleted'});
        return res.status(200).send({message: 'Category deleted sucessfully', deletedCategory});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error removing category'});
    }
}

exports.getCategories = async(req, res)=>{
    try{
        let categories = await Category.find();
        return res.status(200).send({categories});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting categories'});
    }
}

exports.getCategory = async(req, res)=>{
    try{
        let categoryName = req.body;
        let category = await Category.findOne({name: categoryName.name});
        if(!category) return res.send({message: 'Category not found'});
        return res.status(200).send({category});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting category'});
    }
}