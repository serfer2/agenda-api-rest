const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Note } = require('../models/note');
const { date2JSON } = require('../utils');

// En testing no hay BBDD de test. Usa la de la App
// beforeEach((done) => {
//     Note.remove({}).then(() => done());
// });

describe('POST Note', () => {
    it('Añadimos una de forma correcta', () => {
        var text = 'Prueba mugri';
        var date = new Date();
        date.setDate(date.getDate() + 3);
        request(app)
            .post('/notes')
            .send({ text: text, date: date })
            .expect(201)
            .then((res) => {
                // Objeto devuelto
                expect(res.body.text).toBe(text);
                expect(res.body.date).toBe(date2JSON(date));

                // Creación en BD
                var id = res.body._id;
                Note.find({ _id: id }).then((notes) => {
                    expect(notes.length).toBe(1);
                    expect(notes[0].text).toBe(text);
                    expect(notes[0].date).toEqual(date);
                });

            }).catch((e) => {
                console.log('Error en request: ', e);
                throw new Error(e);
            });
    });

    it('Falla POST', (done) => {
        request(app)
            .post('/notes')
            .send({ falla: 'falla' })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});

describe('GET all Notes', () => {
    it('Should return all Notes', (done) => {
        request(app)
            .get('/Notes')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});