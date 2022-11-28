const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require('../config/config');

const sendResetPasswordMail=async(name,email,token) => {
    try {
        const transport = nodemailer.createTransport({
            host: 'smtp',
            port: 1200,
            secure: false,
            requireTLS: true,
            service: 'gmail',
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        })
        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'Reset Password',
            html:'<p>Hii '+name+',Please click here to <a href="http://localhost:1590/forget-password?token=' +token+'">reset</a> your Password.'
        }
        transport.sendMail(mailOptions , function (error,info){
            if (error) {
                console.log(error.message);
            }
            else{
                console.log("Email has been send",info.response);
            }
        })
    } catch (error) {
        console.log('mailing error',error.message);
    }
}

const loadLogin = async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log('load login error',error.message);
    }
}

const verifyLogin = async(req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});
        if (userData) {
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if (passwordMatch) {
                req.session.user_id = userData._id;
                req.session.is_admin =userData.is_admin; 
                if (userData.is_admin == 1) {
                    res.redirect('/dashboard');
                } else {
                    res.redirect('/profile');
                }
            } else {
                res.render('login',{message:'Email or password does not match'})
            }
        } else {
            res.render('login',{message:'Email or password does not match'})
        }
    } catch (error) {
        console.log('error in verifying login',error.message);
    }
}

const profile = async(req,res)=>{
    try {
        res.send('profile')
    } catch (error) {
        console.log('profile error',error.message);
    }
}

const logout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log('logout error',error.message);
    }
}

const forgetLoad = async(req,res) => {
    try {
        res.render('forget-password');
    } catch (error) {
        console.log('forget loading error',error.message);
    }
}

const forgetPasswordVerify = async(req,res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if (userData) {
            const randomString = randomstring.generate();
            await User.updateOne({email:email},{$set:{token:randomString}});
            sendResetPasswordMail(userData.name, userData.email, randomString);
            res.render('forget-password',{message:"please check your mail to reset your password !"})
        } else {
            res.render('forget-password',{message:"email is incorrect"});
        }
    } catch (error) {
        console.log('forgetting error',error.message);
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    profile,
    logout,
    forgetLoad,
    forgetPasswordVerify
}