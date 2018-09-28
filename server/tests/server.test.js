// USO:  npm run test-watch

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

describe('GET Note by ID', () => {
    it('Should return one Note (the one that it creates)', (done) => {

        // Crear Note para la ocasión
        var date = new Date();
        date.setDate(date.getDate() + 3);
        var text = 'Nueva nota para test de get by ID';
        var note = new Note({ text: text, date: date });
        note.save().then((doc) => {

            // Test del API
            request(app)
                .get(`/notes/${doc._id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    // console.log('Note creada para la ocasión: ', res.body._id);
                    expect(res.body._id).toBe('' + doc._id);
                    expect(res.body.text).toBe(text);
                    expect(res.body.date).toBe(date2JSON(date));

                    // Eliminar registro recién creado
                    Note.deleteOne({ _id: res.body._id })
                        .then((doc) => {
                            done();
                        }, (err) => {
                            done(err);
                        })
                        .catch((e) => done(e));
                });
        }, (err) => {
            console.log('Error salvando new Note');
            done(err)
        }).catch(e => done(e));
    });
});

describe('DELETE Note by ID', () => {
    it('Should delete one Note by ID (the one that it creates) and return Note', (done) => {

        // Crear Note para la ocasión
        var date = new Date();
        date.setDate(date.getDate() + 3);
        var text = 'Nueva nota para test de get by ID';
        var note = new Note({ text: text, date: date });
        note.save().then((doc) => {

            console.log(`Agenda API TEST - Created for deleting: ${doc._id}`);

            // Test del API
            request(app)
                .delete(`/notes/${doc._id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    // console.log('Note creada para la ocasión: ', res.body._id);
                    expect(res.body._id).toBe('' + doc._id);
                    expect(res.body.text).toBe(text);
                    expect(res.body.date).toBe(date2JSON(date));
                    done();
                });
        }, (err) => {
            console.log('Error salvando new Note');
            done(err)
        }).catch(e => done(e));
    });
});