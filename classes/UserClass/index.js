import { User } from "../../models";
import dbConnect from "../../src/dbConfig";
import { jsonify } from "../index";

export default class UserClass {
	constructor() {}

	async getAll() {
		await dbConnect();
		return jsonify(await User.find().populate("company", "name").populate("profile", "name").populate("position", "name"));
	}

	async get(id) {
		await dbConnect();
		return jsonify(await User.findById(id).populate("companies", "name").populate("profiletypes", "name").populate("position", "name"));
	}

	async getByFilter(data) {
		await dbConnect();
		return jsonify(await User.find(data).populate("company", "name").populate("profile", "name").populate("position", "name"));
	}

	async add(data) {
		await dbConnect();
		return jsonify(await new User(data).save().then((user) => user.populate("companies", "name").populate("profiletypes", "name").populate("positions", "name").execPopulate()));
	}

	async update(data) {
		await dbConnect();
		return jsonify(
			await User.findByIdAndUpdate(data._id, {
				$set: {
					name: data.name,
					company: data.company,
					profile: data.profile,
					position: data.position,
					active: data.active,
					password: data.password, //md5(data.password + hash),
					logo: data.logo,
					priceHour: data.priceHour,
				},
			})
				.populate("companies", "name")
				.populate("profiletypes", "name")
				.populate("position", "name")
		);
	}

	async delete(id) {
		await dbConnect();
		return jsonify(await User.findByIdAndDelete(id).populate("companies", "name").populate("profiletypes", "name").populate("position", "name"));
	}
}
