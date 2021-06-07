"use strict";
const mongoose = require("mongoose");

const TypeCallModel = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	slaDefault: { type: Number, required: true },
	active: { type: Boolean, required: true, default: true },
	creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.models.TypeCall || mongoose.model("TypeCall", TypeCallModel);
