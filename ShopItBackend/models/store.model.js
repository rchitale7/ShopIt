const mongoose = require('mongoose');
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
    items: {
        type: [item.schema],
        default: []
    }
}, {
    timestamps: true
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;