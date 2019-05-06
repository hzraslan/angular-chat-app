// require express
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
// path module -- try to figure out where and why we use this
var path = require("path");
// var exphbs  = require('express-handlebars');
var http = require('http');

var mongoose = require('mongoose');
var passport = require('passport');

// var session = require('express-session');
const flash = require('express-flash');

const cors = require('cors');
app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const config = require('./server/config/mongoose.js')

mongoose.connect(config.mongoose, { useNewUrlParser: true });

app.use(passport.initialize());
app.use(passport.session());
require('./server/config/passport')(passport);
// root route to render the index.ejs view

require('./server/config/routes.js')(app);
app.use(express.static( __dirname + '/public/dist/public' ));

app.all("*", (req,res,next) => {
  res.sendFile(path.resolve("./public/dist/public/index.html"))
})


app.listen(4000, function() {
 console.log("listening on port 4000");
});
