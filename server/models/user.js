var { mongoose } = require('../db/mongoose');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        dropDups: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        dropDups: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

var User = mongoose.model('User', userSchema);

module.exports = { User, userSchema };