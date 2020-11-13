const express = require('express');

const router = express.Router();
let Sector = require('../models/sector.model');

// Return all sectors
router.route('/').get((req, res) => {
    Sector.find()
        .then(sectors => res.json(sectors))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Add new sector to database
router.route('/add').post((req, res) => {
    const newSector = new Sector();

    newSector.save()
        .then((sector) => res.json(`A new Sector (${sector._id}) was added!`))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Delete sector from database given its _id
router.route('/delete').delete((req, res) => {
    const id = req.body.id;
    
    // Will add image deletion later
    Sector.findOneAndDelete({ _id: { $eq : id } })
        .then((sector) => res.json(`Sector has been deleted!`))
        .catch(err => res.status(400).json(`Unable to delete sector. Error: ${err}`));
});

module.exports = router;