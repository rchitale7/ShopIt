const mongoose = require('mongoose');
const item = require('./item.model.js');

const schema = mongoose.Schema;

const sectorSchema = new schema({
    items: {
        type: [item.schema],
        required: true
    }
}, {
    timestampes: true
});

const Sector = mongoose.model('Sector', sectorSchema);

module.exports = Sector;