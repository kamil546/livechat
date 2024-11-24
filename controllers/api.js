const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



exports.user_basic = async (req,res) => {
var user_id = 0;    
if(req.user!==null) user_id = req.user.user_id;


const user_basic = await prisma.chat_users.findFirst({
    where:{
        user_id: user_id
    }
});


res.status(200).json(user_basic);
};


exports.get_channels = async (req,res) => {
    var user_id = 0;    
    if(req.user!==null) user_id = req.user.user_id;
    if (typeof req.body.is_public !== 'boolean') return res.status(401).json({message:'Nie poprawna wartosc typu kanału..'});



    
    const channel_list = await prisma.chat_channels.findMany({
        where:{
            public: req.body.is_public
        }
    });
    
    
    res.status(200).json({list: channel_list});
    };