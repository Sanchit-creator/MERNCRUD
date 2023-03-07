const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require("cookie-Parser") ;
app.use(cookieParser()) ;

dotenv.config({path: './config.env'});
require('./db/conn');
app.use(express.json());
app.use(require('./router/auth'));
// const User = require('./model/userSchema');
const PORT = process.env.PORT;
// MiddleWare





// app.get('/about', (req, res) => {
//     console.log(`Hello About`);
//     res.send(`Hello About`);
// });

// app.get('/contact', (req, res) => {
//     // res.cookie("test", 'sanchit');
//     res.send(`Hello Contact`);
// });

app.get('/signin', (req, res) => {
    res.send(`Hello Login World`);
});

app.get('/signup', (req, res) => {
    res.send(`Hello Registeration WOrld`);
});

app.listen(PORT, ()=>{
    console.log(`Server is runnig at port no. ${PORT}`);
})