import { Call } from "../../models";
import dbConnect from "../../src/dbConfig";
import { jsonify } from "../index";

export default class CallClass {
	constructor() {}

	async getAll() {
		await dbConnect();
		return jsonify(await Call.find().populate("user", "name").populate("project", "name").populate("status", "name").populate("typeCall", "name"));
	}

	async get(id) {
		await dbConnect();
		return jsonify(await Call.findById(id).populate("user", "name").populate("project", "name").populate("status", "name").populate("typeCall", "name"));
	}

	async getByFilter(data) {
		await dbConnect();
		return jsonify(await Call.find(data).populate("user", "name").populate("project", "name").populate("status", "name").populate("typeCall", "name"));
	}

	async add(data) {
		await dbConnect();
		return jsonify(await new Call(data).save().then((call) => call.populate("user", "name").populate("project", "name").populate("status", "name").populate("typeCall", "name").execPopulate()));
	}

	async update(data) {
		await dbConnect();
		return jsonify(
			await Call.findByIdAndUpdate(data._id, {
				$set: {
					title: data.title,
					description: data.description,
					dateStart: data.dateStart,
					dateEnd: data.dateEnd,
					user: data.user,
					dateModified: data.dateModified,
					userModified: data.userModified,
					type: data.type,
					status: data.status,
					project: data.project,
				},
			})
				.populate("user", "name")
				.populate("project", "name")
				.populate("status", "name")
				.populate("typeCall", "name")
		);
	}

	async delete(id) {
		await dbConnect();
		return jsonify(await Call.findByIdAndDelete(id).populate("user", "name").populate("project", "name").populate("status", "name").populate("typeCall", "name"));
	}
}
