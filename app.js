var express = require("express");
var app = express();
var mongoose = require("mongoose");
var isURL = require("is-url");

mongoose.connect(process.env.DATABASEURL);
var urlSchema = new mongoose.Schema({
    url: String,
    shrink: Number
});

var URL = mongoose.model("URL", urlSchema);

app.get("/", function(req, res) {
    res.send("This is the URL Shortener Microservice! add new/yourURL to the address bar to shorten!")    
});

app.get("/new/*", function(req, res) {
    var urlString = req.params[0];
    
    if (isURL(urlString)) {
        URL.findOne({ url: urlString }, function(err, foundURL) {
            if (err || foundURL === null) {
                URL.find().exec(function(err, results) {
                    var count = results.length
                    var urlObj = {
                        url: urlString,
                        shrink: count
                    };
                    URL.create(urlObj);
                    var returnObj = {
                        original_url: urlString,
                        short_url: "https://shrinkurl-lukeyuan.c9users.io/" + count
                    }
                    res.send(returnObj);
                });
            } else {
                res.send({
                    original_url: urlString,
                    short_url: "https://shrinkurl-lukeyuan.c9users.io/" + foundURL.shrink
                })
            }
        })
    } else {
        res.send("Please enter a valid URL!");
    }

});

app.get("/:short", function(req, res) {
    var short = Number(req.params.short);
    URL.findOne({ shrink: short }, function(err, foundURL) {
        if (err || foundURL === null) {
            res.send("This URL goes nowhere.");
        }
        else {
            res.redirect(foundURL.url)
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started!");
});