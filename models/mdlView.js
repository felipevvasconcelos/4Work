const mongoose = require("mongoose");

const ViewModel = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	active: { type: Boolean, required: true, default: true },
	creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.models.View || mongoose.model("View", ViewModel);
