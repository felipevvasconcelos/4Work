// 'use strict';

const mongoose = require('mongoose');

const PermissionCommandModel = new mongoose.Schema({
    command: {type: String, required: true, trim: true},
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProfileType',
        required: true
    },
    allow: {type: Boolean, required: true, default: true},
    active: {type: Boolean, required: true, default: true},
    creationDate: {type: Date, default: Date.now},
});

module.exports = mongoose.models.PermissionCommand || mongoose.model("PermissionCommand", PermissionCommandModel);