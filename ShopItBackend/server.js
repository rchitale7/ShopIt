/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({origin: ["http://localhost:3000"], credentials: true}));
app.use(express.json());
app.use(cookieParser());

const uri = process.env.ATLAS_URI;
mongoose.set('useFindAndModify', false);
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });


const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/items');
const storesRouter = require('./routes/stores');

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Mongoose connection opened!");

    app.listen(port, () => {
        console.log(`This app is running on port ${port}!\n`);
        app.emit("Ready");
    });

    app.get('/', (req, res) => { res.json('Welcome to ShopIt\'s API!') });
    app.use('/users', usersRouter);
    app.use('/items', itemsRouter);
    app.use('/stores', storesRouter);
})

module.exports = app;
