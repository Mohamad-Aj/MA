const { render } = require('ejs');
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db')
const Nurse = require('../models/nurse')



router.route('/register').get((req, res) => {
    res.render('nurse/register')
})

router.get('/login', (req, res) => {
    res.render('nurse/login')
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.render('nurse/Index', { id: id })
})



router.route('/login').post( async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        User.findOne({ email: email })
            .then((user) => {
                if (!user) { res.redirect('/login404').json({ mssg: "User does not exist" }) }
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    Nurse.findOne({ PDS: user.ID })
                        .then((result) => {
                            if(result) { res.redirect(`/nurse/${user.id}`)
                        res.end()}
                        else{
                            res.redirect('/login404');
                        }
                               
                        });

                })
            })
    }
    catch {
        res.redirect('/login404')
    }
})


router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.session.destroy(()=>{
            res.redirect('/login');
          });
    });
});


module.exports = router;