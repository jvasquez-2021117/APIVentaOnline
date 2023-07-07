'use strict'

const jwt = require('jsonwebtoken');

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization) return res.status(403).send({message: 'Doesnt contain headers "AUTHORIZATION'});
    try{
        let token = req.headers.authorization.replace(/['"]+/g, '');
        var playload = jwt.decode(token, `${process.env.PROYECT_KEY}`)
        if(Math.floor(Date.now()/1000 ) >= playload.exp){
            return res.status(401).send({message: 'Expired token'})
        }
    }catch(err){
        console.error(err);
        return res.status(401).send({message: 'Invalid Token'});
    }
    req.user = playload;
    next();
}

exports.isAdmin = async(req, res, next)=>{
    try{
        let user = req.user;
        if(user.role !== 'ADMIN') return res.status(403).send({message: 'Unauthorized user'});
        next();
    }catch(err){
        console.error(err);
        return res.status(403).send({message: 'Unauthorized user'});
    }
}