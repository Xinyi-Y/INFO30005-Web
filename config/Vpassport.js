require('dotenv').config()
const LocalStrategy = require('passport-local').Strategy;

const { Vendor } = require('../models/db');


const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(_id, done) {
        Vendor.findById(_id, function(err, user) {
            done(err, user);
        });
    });
    passport.use('local-login', new LocalStrategy({
            usernameField : 'email', 
            passwordField : 'password',
            passReqToCallback : true},
        function(req, email, password, done) {
            process.nextTick(function() {
                Vendor.findOne({ 'vendorName' :  email }, function(err, user) {
                    if (err)
                        return done(err);
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    if (!user.validPassword(password)){
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    else {
                        req.session.email = email;
                        return done(null, user, req.flash('loginMessage', 'Login successful'));
                    }
                });
            });

        }));


    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.PASSPORT_KEY;
    passport.use('jwt', new JwtStrategy(opts, (jwt_payload, done) => {
        Vendor.findOne({'vendorName':jwt_payload.body._id}, (err, user) => {

            if(err){
                return done(err, false);
            }

            if(user){
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));

    passport.use('login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password'
    }, async (email, password, done) => {
        try {
            Vendor.findOne({ 'vendorName' :  email }, function(err, user) {

                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, {message: 'No user found.'});

                if (!user.validPassword(password))
                    return done(null, false, {message: 'Oops! Wrong password.'});


                else {
                    return done(null, user, {message: 'Login successful'});
                }
            });
        } catch (error) {
            return done(error);

        }
    }));


};



