const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const registerValidation = require('../../validation/register');
const loginFormValidation = require('../../validation/login');


router.post('/register', (req, res) => {
    // validate user information for registration
    const {errors, isValid} = registerValidation(req.body);
    if(!isValid) {
        const json = {
            success: false,
            message: 'User registration failed!!',
            errors: errors
        }
        return res.status(200).json(json);
    }
    // check user already exist
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                const json = {};
                json.success = false;
                json.message = "Email already exists";
                json.errors = errors;
                return res.status(200).json(
                    json
                );
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: 200,
                    r: 'pg',
                    d: 'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                })
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    else {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                console.log('error in hash');
                            } else {
                                newUser.password = hash
                                newUser.save()
                                    .then(user => {
                                        const json = {};
                                        json.success = true;
                                        json.message = '';
                                        json.data = user;
                                        res.json(json);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            }
                        })
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const {errors, isValid} = loginFormValidation(req.body);

    if(!isValid) {
        const json = {
            success: false,
            message: 'form validation failed',
            errorMsg: errors 
        }
        res.status(200).json(json);
    }
    // check if user exist or not
    User.findOne({
            email
        })
        .then(user => {
            if (!user) {
                return res.status(200).json({
                    success: false,
                    message: 'User not found'
                });
            } else {
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const payload = {
                                id: user.id,
                                name: user.name,
                                avatar: user.avatar
                            }
                            jwt.sign(payload, 'secrete', {
                                expiresIn: '1h'
                            }, (err, token) => {
                                if (!err) {
                                    return res.json({
                                        success: true,
                                        data: 'bearer ' + token
                                    })
                                }
                            });
                        } else {
                            const json = {
                                success: false,
                                status: 200,
                                message: 'Password is invalid'
                            };
                            return res.status(200).json(json);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        })
        .catch(err => {
            console.log(err);
        })
})


router.get('/current',  passport.authenticate('jwt', {session : false}), (req, res) => {
  res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
  });
});






module.exports = router;