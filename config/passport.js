const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const users = mongoose.model('users');
const keys = require('../config/keys');

const opt = {};

opt.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('jwt');
opt.secretOrKey = keys.secrete;

module.exports = passport => {
    passport.use(new JwtStrategy(opt, (jwt_payload, done) => {
        users.findById(jwt_payload.id)
        .then(user => {
            if(user) {
                return done(null, user)
            }
            return(null, false);
        })
        .catch(err => console.log(err));
      }))
}

