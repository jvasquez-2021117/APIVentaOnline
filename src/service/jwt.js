'use strict'

const jwt = require('jsonwebtoken');

exports.createToken = async(user)=>{
    try{
        let playload = {
            sub: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now()/ 1000),
            exp: Math.floor(Date.now()/ 1000) + (60*120)
        }
        return jwt.sign(playload, `${process.env.PROYECT_KEY}`);
    }catch(err){
        console.error(err);
        return err;
    }
}