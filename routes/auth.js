const express = require('express');
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const knex = require('../db/knex');
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
const helpers = require("../helpers/authHelpers");

//use passport
passport.use(new LocalStrategy({
    usernameField: 'user[username]',
    passwordField: 'user[password]',
    passReqToCallback: true
}, function(req, username, password, done) {
    knex('users').where('username', username).first().then(user => {
            if (!user) {
                return done(null, false, { message: "Incorrect password/username" });
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password/username' });
                } else {
                    return done(null, user, { message: "Welcome back!" });
                }
            });
        }).catch(err => {
            console.log("Deserialize failed", err);
            done(err, false);
        });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    knex('users').where({ id }).first()
        .then((user) => {
            done(null, user);
        }).catch(err => {
            console.log("Deserialize Failed", err);
            done(err, false);
        });
});

//login
router.get('/login', helpers.preventLoginSignup, (req, res) => {
    res.render('auth/login', {message: req.flash('error')});
});



router.post('/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash: true

}));

//signup
router.get('/signup', helpers.preventLoginSignup, (req, res) => {
    res.render('auth/signup');
});
//post
router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.user.password, SALT_WORK_FACTOR, (err, hash) => {
        knex('users').insert({
            username: req.body.user.username,
            password: hash
        }).then(() => {
            res.redirect('/auth/login');
        }).catch(err => {
            console.log("Error: " + err)
            res.render('errors');
        });
    });
});



router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/auth/login');
});


module.exports = router;
