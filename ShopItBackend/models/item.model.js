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
        type: mongoose.Decimal128,
        required: true

    },
    imageURL: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }, 
    size: {
        type: String,
        required: true
    }, 
    storeID: {
        type: String,
        required: true
    }, 
    aisleNumber: {
        type: Number, 
        required: true
    }, 
    sectorX: {
        type: Number,
        required: true
    }, 
    sectorY: {
        type: Number, 
        required: true
    }
}, {
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;