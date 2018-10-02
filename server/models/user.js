const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const { mongoose } = require('../db/mongoose');
const JWT_KEY = 'morcillastraigo33';

var UserSchema = mongoose.Schema({
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

// -- Instance methods

UserSchema.methods.toJSON = function() {
    // No usamos arrow func, no tendríamos el bind
    var obj = this.toObject(); // de mongoose a regular object
    return _.pick(obj, ['_id', 'name', 'email', 'isAdmin']);
};

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, JWT_KEY).toString();

    // user.tokens.push({ access, token });
    user.tokens = user.tokens.concat([{
        access,
        token
    }]);

    return user.save().then(() => {
        return token;
    });
};

// -- Model static methods
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, JWT_KEY);
        // console.log('decoded: ', decoded);
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = { User, UserSchema };