"use strict";
import mongoose from "mongoose";

const TimeSheetModel = new mongoose.Schema({
	description: { type: String, required: true, trim: true },
	date: { type: Date, default: Date.now },
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project",
		required: true,
	},
	improvement: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Improvement",
		required: true,
	},
	call: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Call",
		required: true,
	},
	hourStart1: { type: Number, required: true },
	hourEnd1: { type: Number, required: true },
	hourStart2: { type: Number, required: true },
	hourEnd2: { type: Number, required: true },
});

export default mongoose.models.TimeSheet || mongoose.model("TimeSheet", TimeSheetModel);
