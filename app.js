const express = require('express');
const path = require('path');
const dotenv = require('dotenv');


dotenv.config({path:"./.env"});
const PORT = process.env.PORT || 3000;
const app = express();


const pub_dir = path.join(__dirname, './public');
app.use(express.static(pub_dir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));
app.use('/api',require('./routes/api'));
app.use('/app',require('./routes/app'));


app.set('view engine','hbs');







app.listen(PORT,()=>{
    console.log(`Serwer uruchomiony na porcie: ${PORT}`);
});