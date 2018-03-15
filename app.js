// Load the dependensies
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')

// Load the config
const config = require('./config')
const port = process.env.PORT || 3000

// express configuration
const app = express()

// parse JSON and uri-encoded qeury
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// print the request log on console
app.use(morgan('dev'))

// set the secret key variable for jwt
app.set('jwt-secret', config.secret)

// index page, just for testing
app.get('/', (req, res) => {
    res.send('Hello JWT')
});

// open the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Express is running on port ${port}`)
});

// onnect to mongodb server
mongoose.connect(config.mongodbUri)
const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
    console.log('connected to monodb server');
});

console.log(`server work on 0.0.0.0:${port}`)