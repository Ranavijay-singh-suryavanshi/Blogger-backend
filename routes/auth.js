const express = require('express');
const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup'
//     ,[
//     body('email')
//     .isEmail()
//     .withMessage('Please enter a valid email.')
//     .custom((value,{req})=>{
//         return User.findOne({email:value}).then(userDoc=>{
//             if(userDoc){
//                 return Promise.reject('E-mail address already exists!');
//             }
//         });
//     }).normalizeEmail(),
//     body('password').trim.isLenght({min:5}),
//     body('name').trim().isEmpty()
// ]
,authController.signup);

router.post('/login',authController.login);
module.exports = router;