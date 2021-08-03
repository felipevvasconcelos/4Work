"use strict";
import mongoose from "mongoose";

const PositionModel = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	active: { type: Boolean, required: true, default: true },
});

export default mongoose.models.Position || mongoose.model("Position", PositionModel);
