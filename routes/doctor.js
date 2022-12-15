const { render } = require('ejs');
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db')
const Doctor = require('../models/doctor')


router.route('/login').get((req, res) => {
    res.render('doctor/login')
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.render('doctor/Index', { id: id })
})

router.get('/Index/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) res.render('doctor/Index', { id: id })
        })
})

router.get('/Appointments/:id', (req, res) => {
    res.render('doctor/Appointments')
})

router.get('/Patients/:id', (req, res) => {
    res.render('doctor/Patients')
})

router.get('/Profile/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) res.render('doctor/Profile', { result: result })
        })
})

router.get('/Notes/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result) res.render('doctor/Notes', { id: id })
        })
})

router.route('/login').post(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        await User.findOne({ email: email })
            .then((user) => {
                if (!user) { res.redirect('/login404').json({ mssg: "User does not exist" }) }
                bcrypt.compare(password, user.password, async (err, result) => {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    if (result) {
                        await Doctor.findOne({ IDS: user.ID })
                            .then((result) => {
                                if (result) {
                                    // res.send("login ok")
                                    res.redirect(`/doctor/${user.id}`)

                                    res.end()
                                }
                                else {
                                    res.redirect('/login404');
                                }

                            });
                    }

                })
            })
    }
    catch {
        res.redirect('/login404')
    }
})

router.route('/Profile/:id').post(async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); 
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            if (result){
                db.collection('users').updateOne({email:result.email},{
                    $set:{
                        password: hashedPassword,
                        email:req.body.email,
                        phonenumber:req.body.phonenumber
                    }
                })
            }
        })
    res.redirect(`/doctor/Profile/${id}`)
})

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.session.destroy(() => {
            res.redirect('/login');
        });
    });
});



module.exports = router;