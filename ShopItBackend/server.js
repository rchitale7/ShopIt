const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Mongoose connection opened!");
})

const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/items');
const storesRouter = require('./routes/stores');


app.get('/', function (req, res) {
    res.send('Welcome to ShopIt\'s API!');
  });

app.use('/users', usersRouter);
app.use('/items', itemsRouter);
app.use('/stores', storesRouter);

app.listen(port, () => {
    console.log(`This sh!t\'s running on port ${port}!`);
}); 