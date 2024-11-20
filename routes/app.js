const router = require('express').Router();
const verify = require('./verify-token');


router.get('/',(req,res)=>{
    res.render('app');
});


module.exports = router;