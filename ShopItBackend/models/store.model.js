const mongoose = require('mongoose');
const item = require('./item.model.js');

const schema = mongoose.Schema;

const storeSchema = new schema({
    name: {
        type: String, 
        required: true
    },
    long: {
        type: Number, 
        required: true
    }, 
    lat: {
        type: Number, 
        required: true
    },
    items: {
        type: [item.schema],
        default: []
    }, 
    floorPlan: {
        type: String, 
        default: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/floorplan-images/sample_map.png'
    }
}, {
    timestamps: true
});

storeSchema.index({lat: 1, long: 1}, {unique: true});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;