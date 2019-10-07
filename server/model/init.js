const mongoose = require('mongoose');
const _ = require('lodash');

// Init Schema
let InitSchema = new mongoose.Schema({
    browser: {
        type: String,
        trim: true
    },
    os: {
        type: String,
        trim: true,
    },
    version: {
        type: String,
        trim: true
    },
    userAgent: {
        type: String,
        trim: true
    },
    ip: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    countryCode: {
        type: String,
        trim: true
    },
    region: {
        type: String,
        trim: true
    }
});

//Creating Mongoose Model
let InitModel = mongoose.model('InitModel', InitSchema);

//Exporting Users 
module.exports = {
    InitModel
};