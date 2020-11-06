const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    admin: {
        default: false
    }
}, {
    timestampes: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;