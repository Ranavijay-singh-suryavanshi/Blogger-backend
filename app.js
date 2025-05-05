const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const bodyParser = require('body-parser');
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const path = require('path');

const app = express();
const PORT = 8080;

const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    fileName:(req,file,cb)=>{
        cb(null,newDate.toISOString()+'-'+file.originalname);
    }
})
const fileFilter = (req,file,cb)=>{
    if(file.mimtype === 'image/png' || file.mimtype === 'image/jpg' ,file.mimtype=== 'image/jpeg'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

// app.use(bodyParser.urlencoded()); //x-www-form-urlencoded <form>

app.use(bodyParser.json()); //  application/json
app.use('/images',express.static(path.join(__dirname,'images'
)));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'))
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    next();
})
app.use('/feed',feedRoutes);
app.use('/auth',authRoutes);

authRoutes
// ranavijay is my db name
mongoose.connect(
    'mongodb://localhost:27017/ranavijay'
).then(
console.log("Server sarted at port:",PORT )
).catch(err=>
    console.log(err)
)

app.listen(PORT,()=>console.log("Server sarted at port:",PORT ))