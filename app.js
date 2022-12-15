const express = require('express');
const app = express();
var path = require('path');
var cons = require('consolidate');
const bodyParser = require("body-parser")
const User = require('./models/user')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const nurseRouter = require('./routes/nurse');
const indexRouter = require('./routes/index')
const doctorRouter = require('./routes/doctor');
const patientRouter = require('./routes/patient');
const { json } = require('body-parser');


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }))

const dbURI = 'mongodb+srv://mohamad_aj3:alonssael12A@cluster0.jtnxgjr.mongodb.net/Hospital?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));
var db = mongoose.connection

db.on("error",console.error.bind(console,"connection error: "));
db.once("open",function(){
    console.log("connected successfully")
})

app.use('/doctor',doctorRouter);

app.listen(3000)