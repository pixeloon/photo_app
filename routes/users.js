const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const helpers = require("../helpers/authHelpers");


router.use(helpers.currentUser);

// index
router.get('/', helpers.ensureAuthenticated, (req, res) => {
    knex('users').then(users => {
        res.render("users/index", { users});
    });
});

//new
router.get('/new', helpers.preventLoginSignup, (req, res) => {
    res.redirect('/auth/signup');

});

// edit
router.get('/:id/edit', helpers.ensureCorrectUser, (req, res) => {
    knex('users').where({ id: +req.params.id }).first()
        .then(user => {
            res.render('users/edit', { user });
        });
});


// show
router.get('/:id', helpers.ensureCorrectUser, (req, res) => {
    knex('users').where({ id: +req.params.id }).first()
        .then(user => {
            res.render('users/show', { user });
        });
});


//update
router.put('/:id', helpers.ensureAuthenticated, (req, res) => {
    knex('users').update(req.body.user).then(() => {
        res.redirect('/');
    });
});

//delete
router.delete('/:id', helpers.ensureAuthenticated, (req, res) => {
    knex('users').where({ id: +req.params.user_id }).del().then((req, res) => {
        res.redirect('/users');

    });

});

module.exports = router;
