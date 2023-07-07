'use strict'

const User = require('./user.model');
const { encrypt, validateData, checkPassword} = require('../utils/validate');
const { createToken } = require('../service/jwt');

exports.test = (req, res)=>{
    res.send({message: 'test fuction is running', user: req.user});
}


exports.register = async(req, res)=>{
    try{
        let data = req.body;
        data.password = await encrypt(data.password);
        data.role = 'client';
        let user = new User(data);
        await user.save();
        return res.status(201).send({message: 'Account created sucessfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating account ', Error: err.message});
    }
}

exports.createSupremeAdmin = async(req, res)=>{
    try{
        let data = {
            name: 'Admin',
            surname: 'Defualt',
            username: 'defaultAdmin',
            password: '123',
            email: 'elAdmin@gmail.com',
            phone: '0000',
            role: 'ADMIN'

        }
        data.password = await encrypt(data.password);
        let exists = await User.findOne({username: 'defaultadmin'});
        if(exists) return console.log('Default admin already exists');
        let user = new User(data);
        await user.save();
        return console.log('Default admin created successfully');
    }catch(err){
        console.error(err);
        return console.log('Error creating admin');
    }
}

exports.save = async(req, res)=>{
    try{
        let data = req.body;
        if(data.role == 'admin' || data.role == 'client'){
            if(data.role !== 'admin'){
                data.password = await encrypt(data.password);
                data.role = 'client';
                let user = new User(data);
                await user.save();
                return res.status(201).send({message: 'Account created sucessfully'});
            }
            data.password = await encrypt(data.password);
            data.role = 'admin';
            let user = new User(data);
            await user.save();
            return res.status(201).send({message: 'Account created sucessfully'});
        }
        return res.send({message: 'Invalid role'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating account', Error: err.message})
    }
}

exports.login = async(req, res)=> {
    try{
        let data = req.body;
        let credentials = {
            username: data.username,
            password: data.password
        }
        let msg = validateData(credentials);
        if(msg) return res.status(400).send({msg});
        let user = await User.findOne({username: data.username});
        if(user && await checkPassword(data.password, user.password)) {
            let token = await createToken(user); 
            return res.status(200).send({message: 'User logged sucessfully', token});
        }
        return res.status(204).send({message: 'Invalid credentials'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not logged'});
    }
}

exports.update = async(req, res)=>{
    try{
        let userId = req.params.id;
        let data = req.body;
        if(userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        if(data.password || Object.entries(data).leng === 0 || data.role) return res.status(400).send({message: 'Have submitted some data that cannot be updated'});
        let userUpdate = await User.findOneAndUpdate(
            {_id: req.user.sub},
            data,
            {new: true}
        )
        if(!userUpdate) res.send({message: 'User not found and not update'});
        return res.status(200).send({message: 'User update', userUpdate});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not update is already token'});
    }
}

exports.updateClient = async(req, res)=>{
    try{
        let userId = req.params.id;
        let data = req.body;
        if(data.password || Object.entries(data).leng === 0) return res.status(400).send({message: 'Have submitted some data that cannot be updated'});
        let user = await User.findOne({_id: userId});
        if(!user) res.status(404).send({message: 'User not found and not update'});
        if(user.role == 'ADMIN') return res.send({message: 'Dont have permission to do this acction'})
        let userUpdate = await User.findOneAndUpdate(
            {_id: userId},
            data,
            {new: true}
        )
        return res.status(200).send({message: 'User update', userUpdate});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating client'});
    }

}

exports.delete = async(req, res)=>{
    try{
        let userId = req.params.id;
        if(userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this acction'});
        let userDelete = await User.findByIdAndDelete({_id: req.user.sub});
        if(!userDelete) return res.send({message: 'Acount not found and not deleted'});
        return res.status(200).send({message: `Account whit username ${userDelete.username} deleted sucessfully`});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not deleted'});
    }
}
exports.deleteClient = async(req, res)=>{
    try{
        let userId = req.params.id;
        let userDelete = await User.findOne({_id: userId});
        if(!userDelete) return res.send({message: 'Acount not found and not deleted'});
        if(userDelete.role == 'ADMIN') return res.send({message: 'Dont have permission to do this acction'});
        await User.findOneAndDelete({_id: userId})
        return res.status(200).send({message: `Account whit username ${userDelete.username} deleted sucessfully`});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting client'});
    }
};

exports.getUsers = async(req, res)=>{
    try{
        let users = await User.find();
        return res.status(200).send({users});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting categories'});
    }
}

exports.getUser = async(req, res)=>{
    try{
        let { username } = req.body;
        let user = await User.findOne({username: username});
        if(!user) return res.send({message: 'User not found'});
        return res.status(200).send({user});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting category'});
    }
}