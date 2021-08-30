const mongoose = require("mongoose");

const ViewModel = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	active: { type: Boolean, required: true, default: true },
	creationDate: { type: Date, default: Date.now },
	permissions: [
		{
			permission: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "ProfileType",
				required: true,
			}
		}
	]
});

module.exports = mongoose.models.View || mongoose.model("View", ViewModel);
