const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

const passport = require('passport');

const mongoDBURI = require('./config/keys').mongodbURI;
var gravatar = require('gravatar');
var cors = require('cors')
var app = express();

app.use(cors())

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
require('./config/passport')(passport);

mongoose.connect(mongoDBURI, { useNewUrlParser: true })
.then(() => {
    console.log('DB connection success');
})
.catch((error)=> {
    console.log(error);
})

app.use('/api/user', users);
app.use('/api/profile', profile);
// app.use('/api/post', posts);

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log('app is runing on port'));