import dbConnect from "../src/dbConfig";
const mongoose = require("mongoose");
const autoNumber = require('mongoose-auto-number');

export default async function mongodb(req, res, next) {
	await dbConnect();

	var afterResponse = function () {
		mongoose.connection.close();
	};
	res.on("finish", afterResponse);
	res.on("close", afterResponse);

	return next();
}
