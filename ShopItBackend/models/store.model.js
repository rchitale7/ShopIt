const mongoose = require('mongoose');
const aisle = require('./aisle.model');
const item = require('./item.model.js');

const schema = mongoose.Schema;

const storeSchema = new schema({
    name: {
        type: String, 
        required: true
    },
    long: {
        type: mongoose.Decimal128, 
        required: true
    }, 
    lat: {
        type: mongoose.Decimal128, 
        required: true
    },
    aisles: {
        type: [aisle.schema], 
        default: []
    }
}, {
    timestamps: true
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;