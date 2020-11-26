const mongoose = require('mongoose');
const item = require('./item.model.js');

const schema = mongoose.Schema;

const storeSchema = new schema({
    name: {
        type: String
    },
    long: {
        type: Number
    }, 
    lat: {
        type: Number
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
storeSchema.set('validateBeforeSave', false); 
storeSchema.path("name").validate(function (value) {
    return value != null
})
storeSchema.path("long").validate(function (value) {
    return value != null
})
storeSchema.path("lat").validate(function (value) {
    return value != null
})


const Store = mongoose.model('Store', storeSchema);

module.exports = Store;