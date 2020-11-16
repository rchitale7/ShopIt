const mongoose = require('mongoose');

const schema = mongoose.Schema;

const aisleSchema = new schema({
    number: {
        type: Number, 
        required: true
    },
    xPos: {
        type: Number,
        required: true
    }, 
    yPos: {
        type: Number, 
        required: true
    }, 
    length: {
        type: Number, 
        required: true
    }, 
    width: {
        type: Number, 
        required: true
    }, 
    sectorWidth: {
        type: Number, 
        required: true
    }, 
    sectorLength: {
        type: Number, 
        required: true
    },
    name: {
        type: String, 
        required: true
    }, 
    rotation: {
        type: mongoose.Decimal128, 
        required: true
    }

});

const itemSchema = new schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    brand: {
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
        trim: true,
        minlength: 1
    }, 
    size: {
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
        type: [aisleSchema], 
        required: true
    }, 
    items: {
        type: [itemSchema], 
        required: true
    }
}, {
    timestamps: true
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;