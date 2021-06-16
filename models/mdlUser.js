"use strict";
import mongoose from "mongoose";
import md5 from "md5";

const hash = process.env.MD5HASH;

const UserModel = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, unique: true, index: true },
		password: { type: String, required: true, trim: true },
		active: { type: Boolean, required: true, default: true },
		creationDate: { type: Date, default: Date.now },
		logo: {
			name: { type: String, trim: true },
			image: { type: String },
		},
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: true,
		},
		profile: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ProfileType",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

UserModel.pre("save", function (next) {
	const user = this;

	if (this.isModified("password") || this.isNew) {
		user.password = md5(user.password + hash);
		next();
	} else {
		return next();
	}
});

export default mongoose.models.User || mongoose.model("User", UserModel);
// export default mongoose.model("User", UserModel, "users");
