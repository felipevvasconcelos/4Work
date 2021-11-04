//"use strict";
import mongoose from "mongoose";

const NotifyModel = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  type: { type: String, required: true },
  ready: { type: Boolean, require: false, default: false },
  date: {type: Date, required: true, default: Date.now()}
});

export default mongoose.models?.Notify || mongoose.model("Notify", NotifyModel);