"use strict";
import mongoose from "mongoose";

const TimeSheetModel = new mongoose.Schema({
	description: { type: String, required: true, trim: true },
	type: { type: String, required: true, trim: true },
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project",
		required: false,
	},
	improvement: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Improvement",
		required: false,
	},
	call: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Call",
		required: false,
	},
	timeStart: { type: Date, required: true },
	timeEnd: { type: Date },
});

export default mongoose.models.TimeSheet || mongoose.model("TimeSheet", TimeSheetModel);
