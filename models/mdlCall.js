"use strict";
import mongoose from "mongoose";
var autoIncrement = require("mongoose-auto-number");

autoIncrement.init(mongoose.connection);

const CallModel = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	callNumber: { type: Number, required: true, unique: true, index: true, autoIncrement: true },
	description: { type: String, required: true, trim: true },
	dateCreate: { type: Date, default: Date.now },
	dateModified: { type: Date, default: Date.now },
	deadline: { type: Date, required: true, default: Date.now },
	userCreate: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	userModified: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	type: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "TypeCall",
		required: true,
	},
    status: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Status",
		required: true,
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project",
		required: true,
	},
});

CallModel.plugin(autoIncrement.plugin, "Call");

export default mongoose.models.Call || mongoose.model("Call", CallModel);
