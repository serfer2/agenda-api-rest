var express = require('express');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectId;

var { User, userSchema } = require('./models/user');
var { Note, noteSchema } = require('./models/note');

var app = express();
var port = process.env.port || 3000;

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

app.get('/notes/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).send();
    }
    Note.findById(req.params.id).then((note) => {
        if (!note) {
            return res.status(404).send();
        }
        res.status(200).send(note);
    }).catch(e => {
        console.log('Exception en Note.findById():', e);
        res.status(400).send('');
    });
});

app.delete('/notes/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).send();
    }
    // findByIdAndRemove is deprecated
    Note.findOneAndDelete({ _id: req.params.id }).then((note) => {
        if (!note) {
            return res.status(404).send();
        }
        console.log('Agenda API - Delete: ', req.params.id);
        res.status(200).send(note);
    }).catch(e => {
        console.log('Exception en Note.findByIdAndRemove():', e);
        res.status(400).send('');
    });
});


app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});

module.exports = { app }; // para testing