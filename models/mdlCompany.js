//"use strict";
const mongoose = require("mongoose");

const CompanyModel = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	companyName: { type: String, required: true, trim: true },
	document: { type: String, required: true, trim: true, unique: true, index: true },
	logo: {
		name: { type: String, trim: true },
		image: { type: String },
	},
	slas: [
		{
			_id: { type: mongoose.Schema.Types.ObjectId, ref: "TypeCall", required: true },
			slaValue: { type: Number },
		},
	],
	address: {
		address: { type: String, required: true, trim: true },
		number: { type: Number, trim: true },
		postalCode: { type: String, required: true, trim: true },
		district: { type: String, required: true, trim: true },
		complement: { type: String, trim: true },
		city: { type: String, required: true, trim: true },
		state: { type: String, required: true, trim: true },
	},
	active: { type: Boolean, required: true, default: true },
	creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Company || mongoose.model("Company", CompanyModel);
