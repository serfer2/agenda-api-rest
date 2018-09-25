var mongoose = require('mongoose');

var nextDay = require('./utils').nextDay;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Agenda', { useNewUrlParser: true });

var noteSchema = mongoose.Schema({
    text: {
        type: String
    },
    date: {
        type: Date,
        default: nextDay
    },
    readed: {
        type: Boolean
    },
    readedAt: {
        // timestamp
        type: Number
    }
});

var Note = mongoose.model('Note', noteSchema);