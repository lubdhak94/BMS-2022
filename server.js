require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = process.env.PORT || 1000;
const dbDriver = process.env.DB_CONNECT

//admin routing
const adminRoute = require('./routes/adminRoute');
app.use('/',adminRoute);

//user routing
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

//blog routing
const blogRoute = require('./routes/blogRoutes');
app.use('/',blogRoute);

//middleware
const isBlog = require('./middlewares/isBlog');
app.use(isBlog.isBlog)

mongoose.connect(dbDriver, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res =>{
    app.listen(port,()=>{
        console.log('DB connected');
        console.log(`server is connected @ http://localhost:${port}`);
    })
}).catch(err =>{
    console.log('error \n', err);
})