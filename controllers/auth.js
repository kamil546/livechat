const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {valid_schema_user_login, valid_schema_user_register} = require('../validationSchemas');




exports.register = async (req,res) =>{
    const user = {
        username : req.body.f_reg_username,
        email: req.body.f_reg_email,
        pass: req.body.f_reg_pass,
    };


    try{
        const {error} = valid_schema_user_register.validate(user);
        if(error) return res.status(401).json({message:error.details[0].message});


        const pass_salt = await bcrypt.genSalt(10);
        const pass_hash = await bcrypt.hash(user.pass,pass_salt);
        const ipaddr = req.connection.remoteAddress;

        const ExistingUser = await prisma.chat_users.findFirst({
            where:{
                OR:[
                    {username: user.username},
                    {email: user.email}
                ]
            }
        });

        if(ExistingUser) return res.status(401).json({message:'Uzytkownik o podanych danych juz istnieje..'});


        const newUser = await prisma.chat_users.create({
            data:{
                username: user.username,
                email: user.email,
                pass_hash: pass_hash,
                ipaddr: ipaddr
            },
        });
        if(newUser) return res.status(200).json({message: 'Zarejestrowano pomyslnie, mozesz sie zalogowac..'});
        return res.status(401)({message:'Wystapil błąd przy dodawaniu do bazy..'});
        

    }
    catch(message){
        console.log(message);
        res.status(500).json({message:"Błąd przy dodawaniu nowego uzytkownika.."});
    }
};


exports.login = async (req,res) =>{
    console.log(req.body);
    try{
        const user = {
            username : req.body.f_log_username,
            pass: req.body.f_log_pass,
        };

        const {error} = valid_schema_user_login.validate(user);
        if(error) return res.status(401).json({message:error.details[0].message});

        const ipaddr = req.connection.remoteAddress;

        const login_user = await prisma.chat_users.findFirst({
            where:{
                OR:[
                    {username: user.username},
                    {email: user.username}
                ]
            }
        });
        if(!login_user) return res.status(404).json({ message:'Nie odnaleziono konta o podanym loginie..'});

        const validPass = await bcrypt.compare(user.pass,login_user.pass_hash);
        if(!validPass) return res.status(401).json({message:'Dane logowania są nie poprawne..'});


        const jwt_token = jwt.sign({user_id: login_user.user_id},process.env.JWT_SECRET,{ expiresIn: '6h' });
        res.status(200).json({jwt_token:jwt_token});

    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Błąd przy próbie logowania.."});
    }
    console.log(req.body);

};