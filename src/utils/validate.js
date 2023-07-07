'use strict'

const bcrypt = require('bcrypt');
const { ObjectId } = require('bson');

exports.encrypt = async(password)=>{
    try{
        return await bcrypt.hash(password, 10);
    }catch(err){
        console.error(err);
        return err;
    }
}

exports.validateData = (data)=>{
    let keys = Object.keys(data), msg = '';
    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += `the params ${key} is requiere\n`
    }
    return msg.trim();
}

exports.validateDataUpdate = (data)=>{
    let keys = Object.keys(data), msg = '';
    for(let key of keys){
        if(data[key] !== '') continue;
        msg += `Add the params ${key} correctly\n`
    }
    return msg.trim();
}

exports.checkPassword = async(password, hash)=>{
    try{
        return await bcrypt.compare(password, hash);
    }catch(err){
        console.error(err);
        return false;
    }
}