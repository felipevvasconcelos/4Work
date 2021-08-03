"use strict";
import mongoose from "mongoose";

const StatusModel = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	module: { type: String, required: true, trim: true },
	active: { type: Boolean, required: true, default: true },
});

export default mongoose.models.Status || mongoose.model("Status", StatusModel);
