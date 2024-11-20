const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
if (!process.env.JWT_SECRET) return res.status(500).json({message: 'Brak klucza JWT.'});

if(!req.header('Authorization')) return res.status(400).json({message: 'Brak autoryzacji..'});
const jwt_token = req.header('Authorization').split(' ')[1];

if(!jwt_token ) return res.status(401).json({message: 'Brak autoryzacji..'});

try{
    const verified = jwt.verify(jwt_token,process.env.JWT_SECRET);
    req.user = verified;
    next();
}
catch(err){
    return res.status(400).json({message: 'Nieprawidłowy token..'});
}

};