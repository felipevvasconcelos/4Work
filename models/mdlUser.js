'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserModel = new Schema({   
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true, unique: true},
    password: {type: String, required: true, trim: true, select: false},
    status: {type: Boolean, required: true, default: true},
    creationDate: {type: Date, default: Date.now},
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProfileType',
        required: true
    }
});

module.exports = mongoose.models.User || mongoose.model('User', UserModel);