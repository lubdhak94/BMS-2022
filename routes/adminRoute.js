const express = require ('express');
const admin_route = express();
const adminController = require("../controllers/adminController");

const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

const session = require('express-session');

const config = require('../config/config')
admin_route.use(session({secret:config.sessionSecret,
    saveUninitialized: true,
    resave: true
}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views');

const multer = require('multer');
const path = require('path');

admin_route.use(express.static('public'));
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/images'));
    },
    filename:function(req,file,cb) {
        const name = Date.now()+'-'+ file.originalname;
        cb(null,name);
        }
});

const fileFilter = (req, file, callback) => {
    if (
      file.mimetype.includes("png") ||
      file.mimetype.includes("jpg") ||
      file.mimetype.includes("jpeg")
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  };

const upload = multer({storage:storage,
    fileFilter: fileFilter,
    limits: { fieldSize: 1024 * 1024 * 5 },
});

const adminLoginAuth = require('../middlewares/adminLoginAuth')

admin_route.get('/blog-setup',adminController.blogSetup);
admin_route.post('/blog-setup',upload.single('blog_image'), adminController.blogSetupSave);
admin_route.get('/dashboard',adminLoginAuth.isLogin,adminController.dashboard);
admin_route.get('/create-post',adminLoginAuth.isLogin, adminController.loadPostDashboard);
admin_route.post('/create-post',adminLoginAuth.isLogin, adminController.addPost);


module.exports = admin_route;