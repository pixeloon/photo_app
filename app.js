//load environment variables
require("dotenv").load();
const express = require('express');
const app = express();

// middleware
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('cookie-session');
const morgan = require('morgan');
const flash  = require('connect-flash');
const routes = require("./routes/index");
const passport = require("passport");
const helpers = require("./helpers/authHelpers");

//setup
app.set('view engine', 'jade');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(session({
  secret: process.env.SECRET
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(helpers.currentUser);

app.get('/', function(req,res){
  res.redirect('/auth/login');
});


app.use('/users', routes.users);
app.use('/auth', routes.auth);
app.use('/users/:user_id/photos', routes.photos);

app.get('*', function(req,res){
  res.render("errors");
});



app.listen(3000, () => {
  console.log("Server listening on port 3000");
});