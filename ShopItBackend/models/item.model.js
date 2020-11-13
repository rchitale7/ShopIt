const mongoose = require('mongoose');

const schema = mongoose.Schema;

const itemSchema = new schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    price: {
        type: Number,
        required: true

    },
    imageURL: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
}, {
    timestampes: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;