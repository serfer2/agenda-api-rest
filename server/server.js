var express = require('express');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectId;
var _ = require('lodash');

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
    if (!_.has(req.body, 'readed')) {
        req.body.readed = false;
    }
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
        // console.log('Agenda API - Delete: ', req.params.id);
        res.status(200).send(note);
    }).catch(e => {
        console.log('Exception en Note.findByIdAndRemove():', e);
        res.status(400).send('');
    });
});


app.patch('/notes/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).send();
    }

    // Sacamos solo los datos que deseamos poder actualizar (si están en request)
    // y los validamos antes de actualizar
    var data = _.pick(req.body, ['text', 'date', 'readed']);
    var ahora = new Date();
    if (_.isBoolean(data.readed)) {
        if (data.readed) {
            data.readedAt = ahora;
        } else {
            data.readedAt = null;
        }

    }
    if (_.has(data, 'date')) {
        data.date = new Date(data.date);
        // No podemos mover notas hacia el pasado, no tiene sentido en una agenda
        if (data.date < ahora) {
            return res.status(400).send();
        }
    }

    // findByIdAndUpdate is deprecated
    // La opción 'new' devuelve el objeto despues de actualizarlo
    Note.findOneAndUpdate({ _id: req.params.id }, { $set: data }, { new: true }).then((note) => {
        if (!note) {
            return res.status(404).send();
        }
        // console.log('Agenda API - PATCH: ', req.params.id);
        res.status(200).send(note);
    }).catch(e => {
        console.log('Exception en Note.findOneAndUpdate():', e);
        res.status(400).send('');
    });
});


app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});

module.exports = { app }; // para testing