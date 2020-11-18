const mongoose = require('mongoose');

const schema = mongoose.Schema;

const aisleSchema = new schema({
    xPos: {
        type: Number,
        required: true
    }, 
    yPos: {
        type: Number, 
        required: true
    },
    // actual length of the entire aisle
    length: {
        type: Number, 
        required: true
    },
    // actual width of the entire aisle
    width: {
        type: Number, 
        required: true
    },
    sectorLength: {
        type: Number, 
        required: true
    },
    // how many sectors span the width
    sectorWidth: {
        type: Number, 
        required: true
    },
    rotation: {
        type: mongoose.Decimal128, 
        required: true
    }
});

const Aisle = mongoose.model('Aisle', aisleSchema);

module.exports = Aisle;