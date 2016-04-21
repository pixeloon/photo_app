const express = require('express');
const knex = require('../db/knex');
const helpers = require("../helpers/authHelpers");
const router = express.Router({ mergeParams: true });

router.get('/', helpers.ensureAuthenticated, helpers.ensureCorrectUserForPost, (req, res) => {
    knex('users').where('id', req.params.user_id)
        .then(user => {
            knex('photos').where('user_id', req.params.user_id).orderBy('id', 'desc')
                .then(photos => {
                    console.log("Photos: " + photos);
                    res.render('photos/index', { user, photos });
                });
        });
});

//new
router.get('/new', helpers.ensureAuthenticated, helpers.ensureCorrectUserForPost, (req, res) => {
    res.render('photos/new', { user_id: req.params.user_id });

});

//show
router.get('/:id', helpers.ensureAuthenticated, helpers.ensureCorrectUserForPost, (req, res) => {
    knex('photos').where("id", req.params.id).first().then(photo => {
        res.render("photos/show", { photo })
    });
});

//edit
router.get('/edit/:id', helpers.ensureAuthenticated, helpers.ensureCorrectUserForPost, (req, res) => {
    knex('photos').where("id", req.params.id).first().then(photo => {
        res.render("photos/edit", { photo })
    });
});


//post
router.post('/', helpers.ensureAuthenticated, helpers.ensureCorrectUserForPost, (req, res) => {
    knex('photos').insert({
            desc: req.body.photo.desc,
            url: req.body.photo.url,
            user_id: req.params.user_id
        })
        .then(() => {
            res.redirect(`/users/${req.params.user_id}/photos`);
        });

});

//update
router.put('/:id', helpers.ensureAuthenticated, helpers.ensureCorrectUserForPost, (req, res) => {
    knex('photos').update(req.body.photo).where('id', +req.params.id)
        .then(() => {
            res.redirect(`/users/${req.params.user_id}/photos`);
        });
});

//delete
router.delete('/:id', helpers.ensureAuthenticated, helpers.ensureCorrectUserForPost, (req, res) => {
    knex('photos').where('id', +req.params.id).del()
        .then(() => {
            res.redirect(`/users/${req.params.user_id}/photos`);
        });
});

module.exports = router;
