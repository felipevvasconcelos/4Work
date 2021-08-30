//"use strict";
import mongoose from "mongoose";

const PermissionModel = new mongoose.Schema({
	view: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "View",
		required: true,
	},
	profile: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "ProfileType",
		required: true,
	},
	allowView: { type: Boolean, required: true, default: true },
	allowCreate: { type: Boolean, required: true, default: true },
	allowEdit: { type: Boolean, required: true, default: true },
	allowDelete: { type: Boolean, required: true, default: true },
	active: { type: Boolean, required: true, default: true },
	creationDate: { type: Date, default: Date.now },
});

export default mongoose.models?.Permission || mongoose.model("Permission", PermissionModel);