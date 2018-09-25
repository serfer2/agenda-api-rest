var express = require('express');
var bodyParser = require('body-parser');

var { User, userSchema } = require('./models/user');
var { Note, noteSchema } = require('./models/note');
var { mongoose } = require('./db/mongoose');

var app = express();

// Usamos middleware para que todo lo que llegue en Body
// de las request sea convertido a objeto JSON al vuelo
//
app.use(bodyParser.json());

app.post('/notes', (req, res) => {
    var nota = new Note(req.body);
    nota.save().then(
        (doc) => {
            res.status(201).send(doc);
        },
        (err) => {
            res.status(400).send(err);
        }
    );
});

app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});