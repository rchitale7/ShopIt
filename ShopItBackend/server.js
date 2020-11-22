/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.set('useFindAndModify', false);
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });


const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/items');
const storesRouter = require('./routes/stores');
const aislesRouter = require('./routes/aisles');

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Mongoose connection opened!");

    app.listen(port, () => {
        console.log(`This app is running on port ${port}!\n`);
    }); 

    app.get('/', (req, res) => { res.json('Welcome to ShopIt\'s API!') });
    app.use('/users', usersRouter);
    app.use('/items', itemsRouter);
    app.use('/stores', storesRouter);
    app.use('/aisles', aislesRouter);
})

module.exports = app;