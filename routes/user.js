var express = require('express');
var router = express.Router();
var validator = require("validator");
var uid = require("shortid");
var User = require("../model/User");

//global.users = [];

/* GET users listing. */
router.get('/', function (req, res) {
    res.render('index',{user:req.session.user || {}});
});

// 注册
router.get("/reg", function (req, res) {
    res.locals.errors = "";
    res.render("reg");
})

router.post("/reg", function (req, res, next) {
    var errors = {}
    var username = req.body.username;
    var password = req.body.password;
    var confirm = req.body.confirm;
    if (!validator.isLength(username, 5, 10)) {
        errors.username = "username string length >5 <10";
    }
    if (!validator.isLength(password, 5, 10)) {
        errors.password = "password string length >5 < 10";
    }

    if (password !== confirm) {
        errors.confirm = "confirm password must === password";
    }

    if (Object.keys(errors).length > 0) {
        res.render("reg", {errors: errors});
    } else {

        var user = new User({username:username,password:password});
        user.save();
        res.redirect("/user/list");
    }
});


router.get("/list", function (req, res) {

    User.find({},function(err,result){
        res.render("list", {users: result});
    })

})


router.get("/login",function(req,res){
    res.render("login");
})

// 登录功能
router.post("/login",function(req,res){

    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username:username,password:password},function(err,user){
        if(user){

            req.session.user = user;

            res.redirect("/user");
            // session
        }else{
            res.render("login",{error:true});

        }
    })


})

// 更改密码
router.get("/uppwd", function (req,res) {
    if(req.session.user){
        res.render("uppwd",{user:req.session.user,errors:{}});
    }else{
        res.render("login");
    }
});

router.post("/uppwd", function (req, res) {

    if(req.session.user) {
        var oldPassword = req.body.oldPassword;
        var newPassword =req.body.newPassword;
        var confirm = req.body.confirm;

        if(req.session.user.password === oldPassword){


            var errors = {}

            if (!validator.isLength(newPassword, 5, 10)) {
                errors.password = "password string length >5 < 10";
            }

            if (newPassword !== confirm) {
                errors.confirm = "confirm password must === password";
            }

            if (Object.keys(errors).length > 0) {
                res.render("uppwd", {errors: errors});
            } else {

                User.findOne({username:req.session.user.username}, function (err,user) {
                    user.password = newPassword;
                    user.save();
                    res.redirect("/user");
                })

            }

            // 旧密码有问题
        }else{

            var errors = {}

                errors.oldPassword = "旧密码错误";

            res.render("uppwd", {errors: errors,user:req.session.user});

        }

    }else{
        res.render("login");
    }


})

module.exports = router;
