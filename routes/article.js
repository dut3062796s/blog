var express = require('express');
var router = express.Router();
var validator = require("validator");
var uid = require("shortid");
var Article = require("../model").Article;

//global.users = [];

/* GET users listing. */
router.get('/', function (req, res) {
    Article.find({}, function (err, articles) {
        res.locals.articles = articles;
        res.render('article/index');
    });

});


router.get("/create", function (req, res) {
    res.render("article/create");
});

router.post("/create", function (req, res) {
    var title = req.body.title;
    var body = req.body.body;
    var article = new Article({title: title, body: body});
    article.save();
    res.redirect("/article");

});

router.get("/del", function (req,res) {
    var aid = req.query.id;
    Article.remove({_id:aid}, function () {
        res.redirect("/article");
    })
})

module.exports = router;
