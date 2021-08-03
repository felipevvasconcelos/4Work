"use strict";
import mongoose from "mongoose";
var autoIncrement = require("mongoose-auto-number");

autoIncrement.init(mongoose.connection);

const ProjectModel = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	projectNumber: { type: Number, unique: true, index: true, autoIncrement: true },
	status: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Status",
		required: true,
	},
	company: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Company",
		required: true,
	},
	includeUsers: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
			hours: { type: Number, required: true },
		},
	],
	dateStart: { type: Date, default: Date.now },
	dateEnd: { type: Date, default: Date.now },

	hoursDevelopment: { type: Number, required: true },
	hoursHomologation: { type: Number, required: true },
	hoursDeploy: { type: Number, required: true },
	hoursDocumentation: { type: Number, required: true },
	hoursSurvey: { type: Number, required: true },
	hoursInteraction: { type: Number, required: true },
	hoursManagement: { type: Number, required: true },
	hoursTotal: { type: Number, required: true },

	priceCalculated: { type: Number, required: true },
	priceCharged: { type: Number, required: true },

	dateCreate: { type: Date, default: Date.now },
	dateModified: { type: Date, default: Date.now },
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
});

ProjectModel.plugin(autoIncrement.plugin, "Project");

export default mongoose.models.Project || mongoose.model("Project", ProjectModel);
