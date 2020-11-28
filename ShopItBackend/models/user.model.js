const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5
    }, 
    password: {
        type: String,
        required: true,
        trim: true
    },
    admin: {
        type: Boolean,
        default: false
    }, 
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        default: null
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;