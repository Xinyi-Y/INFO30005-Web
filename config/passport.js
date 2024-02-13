require('dotenv').config()
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../models/db');
const { Vendor } = require('../models/db');

const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        var isuser;
        if(typeof user.loginId !=='undefined'){
            console.log(user.loginId);
            isuser = 1;
        }else{
            isuser = 0;
        }
        done(null,{id:user._id,isUser:isuser});
    });

    passport.deserializeUser(function(obj, done) {
        if(obj.isUser == 1){
            User.findById(obj.id, function(err, user) {
                done(err, user);
            });
        }else{
            Vendor.findById(obj.id, function(err,user){
                done(err,user);
            })
        }
    });
    passport.use('local-login', new LocalStrategy({
            usernameField : 'email', 
            passwordField : 'password',
            passReqToCallback : true},
        function(req, email, password, done) {
            process.nextTick(function() {
                User.findOne({ 'loginId' :  email }, function(err, user) {
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

        passport.use('local-Vlogin', new LocalStrategy({
            usernameField : 'email', 
            passwordField : 'password',
            passReqToCallback : true},
        function(req, email, password, done) {
            process.nextTick(function() {
                Vendor.findOne({ 'vendorName' :  email }, function(err, user) {
                    if (err){
                        return done(err);
                    }
                        
                    if (!user){
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }
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

    // for signup
    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true },
         function(req, email, password, done) {             
            process.nextTick( function() {
                User.findOne({'loginId': email}, function(err, existingUser) {
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (existingUser) {
                        console.log("existing");
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    }
                    else {
                        var newUser = new User();
                        newUser.loginId = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.lastName = req.body.nameFamily;
                        newUser.firstName = req.body.nameGiven;
                        newUser.orders = [];
                        newUser.tempVendor = -1;
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                        req.session.email=email;
                    }
                });
            });
        }));

    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.PASSPORT_KEY;
    passport.use('jwt', new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({'loginId':jwt_payload.body._id}, (err, user) => {

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
            User.findOne({ 'loginId' :  email }, function(err, user) {

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



