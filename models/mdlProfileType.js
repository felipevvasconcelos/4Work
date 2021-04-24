// "use strict";
const mongoose = require("mongoose");

const ProfileTypeModel = new mongoose.Schema({
	name: { type: String, required: true, trim: true, unique: true },
	status: { type: Boolean, required: true, default: true },
	creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.models.ProfileType || mongoose.model("ProfileType", ProfileTypeModel);
