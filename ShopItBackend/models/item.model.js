const mongoose = require('mongoose');

const schema = mongoose.Schema;

const itemSchema = new schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['Meat', 'Dairy', 'Vegetables', 'Fruit', 'Wheat', 'Candy', 'Alcohol', 'Beverages'],
        required: true
    },
    price: {
        type: mongoose.Decimal128,
        required: true
    },
    imageURL: {
        type: String,
        default: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
    },
    sectorX: {
        type: Number,
        required: true
    }, 
    sectorY: {
        type: Number, 
        required: true
    },
    aisle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aisle',
        required: true
    }
}, {
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;