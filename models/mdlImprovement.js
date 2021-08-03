"use strict";
import mongoose from "mongoose";

const ImprovementModel = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	improvementNumber: { type: Number, required: true },
	description: { type: String, required: true, trim: true },
	hoursDevelopment: { type: Number, required: true },
	dateStart: { type: Date, default: Date.now },
	dateEnd: { type: Date, default: Date.now },
	dateCreate: { type: Date, default: Date.now },
	dateModified: { type: Date, default: Date.now },
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	],
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
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project",
		required: true,
	},
	status: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Status",
		required: true,
	},
});

export default mongoose.models.Improvement || mongoose.model("Improvement", ImprovementModel);
