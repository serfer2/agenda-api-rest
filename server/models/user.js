var validator = require('validator');

var { mongoose } = require('../db/mongoose');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        dropDups: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid e-mail'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
});

var User = mongoose.model('User', userSchema);

module.exports = { User, userSchema };