const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate')
const cookieParser = require('cookie-parser')
router.use(cookieParser())


require('../db/conn')
const User = require("../model/userSchema")

router.get('/', (req, res) => {
    res.send(`Hello world from the server router js`);
});

// router.post('/register', (req, res) => {
//     const { name, email, phone, work, password, cpassword } = req.body;
//     if (!name || !email || !phone || !work || !password || !cpassword ) {
//         return res.status(422).json({error: "Please fill al feild"})
//     }
//     User.findOne({email:email})
//     .then((userExist) => {
//         if (userExist) {
//             return res.status(422).json({error: "Email Already Exist"})
//         }
//         const user = new User({
//             name, email, phone, work, password, cpassword
//         })
//         user.save().then(()=>{
//             res.status(201).json({message: "user registered successfully"})
//         }).catch((err) => res.status(500).json({error: "Failed Registered"}))
//     }).catch(err => {console.log(err);})
// }) 

router.post('/register', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;
    if (!name || !email || !phone || !work || !password || !cpassword ) {
        return res.status(422).json({error: "Please fill al feild"})
    }

    try {
        const userExist = await User.findOne({email:email})
        if (userExist) {
            return res.status(422).json({error: "Email Already Exist"})
        }else if (password !== cpassword) {
            return res.status(422).json({error: "password not matching"})
        }else{
            const user = new User({
                name, email, phone, work, password, cpassword
            }) 
            
            await user.save();
            
            res.status(201).json({message: "user registered successfully"})
            
        }
    } catch (error) {
        console.log(error);
    }
    
});


router.post('/signin', async (req, res) => {
    // console.log(req.body);
    // res.json({ message : "awesome" });
    try {
        let token;
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({error: "Invalid"})
        }

        const userLogin = await User.findOne({email:email});
        if (userLogin) {
            const isMatch = await bcrypt.compareSync(password, userLogin.password);
            token = await userLogin.generateAuthToken();
            console.log(token);
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })
            if (!isMatch) {
                res.status(400).json({message: "Invalid Credential"})
            }else{
                res.json({message: "user sign in successfully"})
            }
        } else {
            res.status(400).json({message: "Invalid Credential"})
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/about', authenticate,(req, res) => {
    console.log(`Hello About`);
    res.send(req.rootUser);
});

router.get('/getData', authenticate, (req, res) => {
    console.log(`Hello About`);
    res.send(req.rootUser);
})

router.post('/contact', authenticate, async (req, res) => {
    try {
        const {name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            console.log("error in contact form");
            return res.json({error: "Please fill the contact form"})
        }

        const userContact = await User.findOne({_id:req.userID});
        if (userContact) {
            const userMessage = await userContact.addMessage(name,email,phone,message);
            await userContact.save();
            res.status(201).json({message:"user Contact successfully"})
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/logout', (req, res) => {
    console.log(`Hello Logout`);
    res.clearCookie('jwtoken', {path:'/'});
    res.status(200).send('User Logout');
});

module.exports = router;
