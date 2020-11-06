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
const rusheesRouter = require('./routes/rushees');

app.get('/', function (req, res) {
    res.send('Welcome to Sift API!');
  });

app.use('/users', usersRouter);
app.use('/rushees', rusheesRouter);

app.listen(port, () => {
    console.log(`This shit\'s running on port ${port}!`);
});