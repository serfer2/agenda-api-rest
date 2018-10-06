var { mongoose } = require('../db/mongoose');

var nextDay = require('../utils').nextDay;

var noteSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    date: {
        type: Date,
        default: nextDay,
        required: true
    },
    readed: {
        type: Boolean,
        deault: false
    },
    readedAt: {
        type: Date,
        default: null
    },
    _creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
});

var Note = mongoose.model('Note', noteSchema);

module.exports = { Note, noteSchema };