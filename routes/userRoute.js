const express = require ('express');
const user_route = express();
const userController = require('../controllers/userController');

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

const session = require('express-session');

const config = require('../config/config')
user_route.use(session({secret:config.sessionSecret,
    saveUninitialized: true,
    resave: true
}));

user_route.set('view engine','ejs');
user_route.set('views','./views');

user_route.use(express.static('public'));


const adminLoginAuth = require('../middlewares/adminLoginAuth')


user_route.get('/login',adminLoginAuth.isLogout,userController.loadLogin);
user_route.get('/logout',adminLoginAuth.isLogin,userController.logout);
user_route.post('/login',userController.verifyLogin);
user_route.get('/profile',userController.profile);
user_route.get('/forget-password',adminLoginAuth.isLogout,userController.forgetLoad);
user_route.post('/forget-password',userController.forgetPasswordVerify);

module.exports = user_route;
