import { Improvement } from "../../models";
import dbConnect from "../../src/dbConfig";
import { jsonify } from "../index";

export default class ImprovementClass {
	constructor() {}

	async getAll() {
		await dbConnect();
		return jsonify(await Improvement.find().populate("user", "name").populate("project", "name").populate("status", "name"));
	}

	async get(id) {
		await dbConnect();
		return jsonify(await Improvement.findById(id).populate("user", "name").populate("project", "name").populate("status", "name"));
	}

	async add(data) {
		await dbConnect();
		return jsonify(await new Improvement(data).save().then((improvement) => improvement.populate("user", "name").populate("project", "name").populate("status", "name").execPopulate()));
	}

	async getByFilter(data) {
		await dbConnect();
		return jsonify(await Improvement.find(data).populate("user", "name").populate("project", "name").populate("status", "name"));
	}

	async update(data) {
		await dbConnect();
		return jsonify(
			await Improvement.findByIdAndUpdate(data._id, {
				$set: {
					title: data.title,
					description: data.description,
					hoursDevelopment: data.hoursDevelopment,
					dateStart: data.dateStart,
					dateEnd: data.dateEnd,
					dateModified: data.dateModified,
					userModified: date.userModified,
					users: data.users,
					project: data.project,
					status: data.status,
				},
			})
				.populate("user", "name")
				.populate("project", "name")
				.populate("status", "name")
		);
	}

	async delete(id) {
		await dbConnect();
		return jsonify(await Improvement.findByIdAndDelete(id).populate("user", "name").populate("project", "name").populate("status", "name"));
	}
}
