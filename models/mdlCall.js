"use strict";
import mongoose from "mongoose";

const CallModel = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	callNumber: { type: Number, required: true },
	description: { type: String, required: true, trim: true },
	dateStart: { type: Date, default: Date.now },
	dateEnd: { type: Date, default: Date.now },
	dateCreate: { type: Date, default: Date.now },
	dateModified: { type: Date, default: Date.now },
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
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

export default mongoose.models.Call || mongoose.model("Call", CallModel);
