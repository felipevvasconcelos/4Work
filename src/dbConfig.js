const mongoose = require("mongoose");

const connection = {};

async function dbConnect() {
	if (mongoose.connection?.readyState >= 1) {
		return;
	}

	return mongoose.connect(process.env.CONNECTION_STRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	});
}

export default dbConnect;
