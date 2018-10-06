// USO:  npm run test-watch

const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Note } = require('../models/note');
const { User } = require('../models/user');
const { date2JSON } = require('../utils');

const { notes, populateNotes, users, populateUsers } = require('./seed/seed');

// En testing no hay BBDD de test. Usa la de la App.
// Eliminamos todo de la BBDD y establecemos unos datos de test
// ¡¡¡ NO ejecutar esto en producción !!!
beforeEach(populateUsers);
beforeEach(populateNotes);

describe('--- POST Note', () => {

    it('POST correcto, con JWT auth', (done) => {

        var text = 'Prueba mugri';
        var date = new Date();
        date.setDate(date.getDate() + 3);

        request(app)
            .post('/notes')
            .set('x-auth', users[0].tokens[0].token)
            .send({ text: text, date: date })
            .expect(201)
            .then((res) => {
                // Objeto devuelto
                expect(res.body.text).toBe(text);
                expect(res.body.date).toBe(date2JSON(date));

                // Probamos creación en BD
                var id = res.body._id;

                return Note.find({ _id: id }).then((notes) => {
                    expect(notes.length).toBe(1);
                    expect(notes[0].text).toBe(text);
                    expect(notes[0].date).toEqual(date);
                });

            }).then(() => done())
            .catch((e) => done(e));

    });

    it('POST error por JWT auth', (done) => {
        request(app)
            .post('/notes')
            .send({ falla: 'falla' })
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

});

describe('GET all Notes', () => {
    it('Should return all Notes from user', (done) => {
        request(app)
            .get('/Notes')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});


describe('GET Note by ID', () => {
    it('Should return one Note', (done) => {

        // Test del API
        request(app)
            .get(`/notes/${notes[0]._id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                // console.log('Note creada para test GET by ID: ', res.body._id);
                expect(res.body._id).toBe('' + notes[0]._id);
                expect(res.body.text).toBe(notes[0].text);
                done();
            });
    });
});

describe('DELETE Note by ID', () => {
    it('Deletes one Note by ID and return Note', (done) => {

        request(app)
            .delete(`/notes/${notes[0]._id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res.body._id).toBe('' + notes[0]._id);
                expect(res.body.text).toBe(notes[0].text);
                done();
            });

    });
});


describe('PATCH Note by ID', () => {
    it('Sets a Note as readed and return Note', () => {

        request(app)
            .patch(`/notes/${notes[0]._id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({ text: notes[1].text, readed: true })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res.body._id).toBe('' + notes[0]._id);
                expect(res.body.text).toBe(notes[1].text);
                expect(res.body.readed).toBe(true);
                expect(res.body.readedAt).toBeTruthy();
                done();
            });
    });
});