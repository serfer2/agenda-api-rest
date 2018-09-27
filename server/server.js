var express = require('express');
var bodyParser = require('body-parser');

var { User, userSchema } = require('./models/user');
var { Note, noteSchema } = require('./models/note');

var app = express();

// Usamos middleware para que todo lo que llegue en Body
// de las request sea convertido a objeto JSON al vuelo
//
app.use(bodyParser.json());

app.post('/notes', (req, res) => {
    // console.log('Server request: ', JSON.stringify(req.body));
    var nota = new Note(req.body);
    nota.save().then(
        (doc) => {
            // console.log('201 ok: ', JSON.stringify(doc));
            res.status(201).send(doc);
        },
        (err) => {
            // console.log('400 err: ', JSON.stringify(err));
            res.status(400).send(err);
        }
    );
});

app.get('/notes', (req, res) => {
    Note.find().then((notes) => {
        res.send(notes);
    });
}, (err) => {
    res.status(400).send(e);
});

app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});

module.exports = { app }; // para testing