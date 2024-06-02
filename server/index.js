// setup
const express = require('express');
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const cors = require('cors');
app.use(cors());

require("dotenv").config({ path: "./.env" });
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const path = require('path');
app.use("/photos",express.static(path.join(__dirname, 'photos'))); 



// import
const connection = require('./connection');
connection();


// routes
const users = require('./src/routes/users');
const dashboard = require('./src/routes/dashboard');
const products = require('./src/routes/products');
const cart = require('./src/routes/carts');
const order = require('./src/routes/orders');
app.use('/user',users);
app.use('/dashboard',dashboard);
app.use('/product',products);
app.use('/cart',cart);
app.use('/order',order);



const System = require('./src/schema/system')
// server
app.get('/',async(req,res)=>{
    res.status(200).send("run successfully...");
});

app.get('/categorylist',async(req,res)=>{
    const data = await System.findOne({},{_id:0});
    res.status(200).json(data);
});

// server
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>console.log(`server running... ${PORT}`))
//app.listen(PORT,'192.168.1.36',()=>console.log(`server running... ${PORT}`))
