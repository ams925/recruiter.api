require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const ct = require('./app/controllers/controllers');
const DB = require('./app/db/db');
const { NewRoutes } = require('./app/routes/routes');
const utils = require('./app/utils/utils')
const app = express();
const port = process.env.APP_PORT || 3000;

DB.Connect(mongoose, utils)
NewRoutes(app, express, ct)

app.listen(port, () => {
    console.log(`connection running on PORT: ${port}`)
})