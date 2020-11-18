const mongoose = require('mongoose');
const aisle = require('./aisle.model');

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
        required: true
    },
    items: {
        type: [item.schema],
        required: true
    }
}, {
    timestamps: true
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;