'use strict';

const mongoose = require('mongoose');

const PermissionViewModel = new mongoose.Schema({
    view: {type: String, required: true, trim: true},
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProfileType',
        required: true
    },
    allow: {type: Boolean, required: true, default: true},
    status: {type: Boolean, required: true, default: true},
    creationDate: {type: Date, default: Date.now},
});

module.exports = mongoose.model('PermissionCommand', PermissionViewModel);