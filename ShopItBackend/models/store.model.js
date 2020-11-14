const mongoose = require('mongoose');

const schema = mongoose.Schema;
const aisleSchema = new schema({
    number: {
        type: Number
    },
    xPos: {
        type: Number
    }, 
    yPos: {
        type: Number
    }, 
    length: {
        type: Number
    }, 
    width: {
        type: Number
    }, 
    sectorWidth: {
        type: Number
    }, 
    sectorLength: {
        type: Number
    },
    name: {
        type: String
    }, 
    rotation: {
        type: mongoose.Decimal128
    }

});
const storeSchema = new schema({

    name: {
        type: String
    },
    long: {
        type: mongoose.Decimal128
    }, 
    lat: {
        type: mongoose.Decimal128
    },
    aisles: {
        type: [aisleSchema]
    }
}, {
    timestamps: true
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;