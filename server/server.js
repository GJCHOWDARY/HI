var express=require("express");
var bodyParser=require('body-parser'),
cookeParser=require('cookie-parser'),
session=require('express-session')
var app = express();
var path = require('path');
var http = require('http');
var db = require(path.resolve('config')).dbConfig;

app.use(express.static(path.join(__dirname, '../views')));
var controllers = require(path.resolve('api')).controllers,
userController = controllers.userController;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
/* route to handle login and registration */
app.use(cookeParser());
app.use(session({key: 'user_sid',
                secret: 'userAuth',
                resave: false,
                saveUninitialized: false,
                cookie: {
                expires: 600000
                }}));
  //Making DB Connection
db.connect(function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  } else {
    console.log('MySQL Successfull')
  }
})
    app.post('/api/login', userController.login);
    app.get('/api/getUserData', userController.getUserData);
    app.get('/api/AuthenticationUser', userController.AuthenticationUser);
    app.post('/api/logout', userController.logout);


app.listen(8080);
console.log('Server running on http://localhost:8080');
