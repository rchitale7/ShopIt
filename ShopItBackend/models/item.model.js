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
    size: {
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
        type: Number,
        required: true
    },
    imageURL: {
        type: String,
        default: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
    },
    posX: {
        type: Number,
        default: 0
    },
    posY: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;