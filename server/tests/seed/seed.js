const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Note } = require('./../../models/note');
const { User, JWT_KEY } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

var pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 3);

const users = [{
    _id: userOneId,
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId.toHexString(), access: 'auth' }, JWT_KEY).toString()
    }]
}, {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass'
}];

const notes = [{
    _id: new ObjectID(),
    text: 'First test Note',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test Note',
    readed: true,
    readeddAt: pastDate,
    _creator: userTwoId
}];

const populateNotes = (done) => {
    Note.deleteMany({}).then(() => {
            return Note.insertMany(notes);
        }).then(() => done())
        .catch((e) => done(e));
};

const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
            var userOne = new User(users[0]).save();
            var userTwo = new User(users[1]).save();

            return Promise.all([userOne, userTwo]);
        }).then(() => done())
        .catch((e) => done(e));
};

module.exports = { notes, populateNotes, users, populateUsers };