const express = require('express');
const app = express();
const appAdmin = express();
const appFoodtype = express(); // Food type

const bodyParser = require('body-parser');
const path = require('path');

const product = require('./modules/Product');
const user = require('./modules/User');
const admin = require('./modules/Admin');
const cart = require('./modules/Cart');
const category = require('./modules/ProductCategory');
const orders = require('./modules/Orders');
const home = require('./modules/Home');
const books = require('./modules/Books');
const store = require('./modules/Store');
const delivery = require('./modules/Delivery');
const faq = require('./modules/Help');
const contact = require('./modules/Contact');
require('dotenv/config');


//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}))

appFoodtype.use(bodyParser.json());
appFoodtype.use(bodyParser.urlencoded({
    extended:true
}))

appAdmin.use(bodyParser.json());
appAdmin.use(bodyParser.urlencoded({
    extended:true
}))
//app.use(express.static('public'));

//cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, x-csrf-token, X-Requested-With, Content-Type, Accept,_cid,token,sessionid");
    next();
})
appFoodtype.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, x-csrf-token, X-Requested-With, Content-Type, Accept,_cid,token,sessionid");
    next();
})
appAdmin.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, x-csrf-token, X-Requested-With, Content-Type, Accept,_cid,token,sessionid");
    next();
})

app.use("/api/product", product);
app.use("/api/user", user);
app.use("/api/admin", admin);
app.use("/api/cart", cart);
app.use("/api/category", category);
app.use("/api/order", orders);
app.use('/api/store', store);
app.use('/api/faq', faq);
app.use('/api/contactus', contact);
//Food type
appFoodtype.use("/api/product", product);
appFoodtype.use("/api/user", user);
appFoodtype.use("/api/admin", admin);
appFoodtype.use("/api/cart", cart);
appFoodtype.use("/api/category", category);
appFoodtype.use("/api/order", orders);
appFoodtype.use('/api/store', store);
appFoodtype.use('/api/faq', faq);
appFoodtype.use('/api/contactus', contact);

//admin
appAdmin.use("/api/product", product);
appAdmin.use("/api/user", user);
appAdmin.use("/api/admin", admin);
appAdmin.use("/api/cart", cart);
appAdmin.use("/api/category", category);
appAdmin.use("/api/order", orders);
appAdmin.use("/api/home", home);
appAdmin.use("/api/delivery", delivery);
app.use("/api/books", books);




// Serve any static files
appAdmin.use(express.static(path.join(__dirname, '/admin_build/buildv2')));
app.use(express.static(path.join(__dirname, '/client_build/build')));
appFoodtype.use(express.static(path.join(__dirname, '/client_build_foodtype/build')));

//Serve images
appAdmin.use(express.static(path.join(__dirname, '/data/images')));
app.use(express.static(path.join(__dirname, '/data/images')));
appFoodtype.use(express.static(path.join(__dirname, '/data/images')));
//server books images
app.use(express.static(path.join(__dirname, '/data/books')));

//handle admin requests
//app.get('/client', function(req, res) {
  //res.sendFile(path.join(__dirname, '/build/client', 'index.html'));
//});
// Handle React routing, return all requests to React app
appAdmin.get('/admin', function(req, res) {
  res.sendFile(path.join(__dirname, '/admin_build/buildv2', 'index.html'));
});
appAdmin.all('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/admin_build/buildv2', 'index.html'));
});
app.all('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/client_build/build', 'index.html'));
});
app.all('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/client_build/build', 'index.html'));
});
//Food type
appFoodtype.all('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/client_build_foodtype/build', 'index.html'));
});
appFoodtype.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/client_build_foodtype/build', 'index.html'));
});
//verifyaccount/sozax1fr54zpv7bsfxfwjjp0539dtjs2q9czu0vpj
app.get('/verifyaccount/:verificationCode', function(req, res) {
  res.sendFile(path.join(__dirname, '/client_build/build', 'index.html'));
});
app.get('/resetpassword/:verificationCode/:emailid', function(req, res) {
  res.sendFile(path.join(__dirname, '/client_build/build', 'index.html'));
});
appFoodtype.get('/verifyaccount/:verificationCode', function(req, res) {
  res.sendFile(path.join(__dirname, '/client_build_foodtype/build', 'index.html'));
});
appFoodtype.get('/resetpassword/:verificationCode/:emailid', function(req, res) {
  res.sendFile(path.join(__dirname, '/client_build_foodtype/build', 'index.html'));
});
appAdmin.get('/signup/:verif_code/:email', function(req, res) {
  res.sendFile(path.join(__dirname, '/admin_build/buildv2', 'index.html'));
});

//port
app.listen(3002);
appAdmin.listen(4002);

appFoodtype.listen(5000);