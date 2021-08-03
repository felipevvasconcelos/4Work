import { Status } from "../../models";
import dbConnect from "../../src/dbConfig";
import { jsonify } from "../index";

export default class StatusClass {
	constructor() {}

	async getAll() {
		await dbConnect();
		return jsonify(await Status.find());
	}

	async get(id) {
		await dbConnect();
		return jsonify(await Status.findById(id));
	}

	async getByFilter(data) {
		await dbConnect();
		return jsonify(await Status.find(data));
	}

	async add(data) {
		await dbConnect();
		return jsonify(await new Status(data).save());
	}

	async update(data) {
		await dbConnect();
		return jsonify(
			await Status.findByIdAndUpdate(data._id, {
				$set: {
					name: data.name,
					module: data.module,
					active: data.active,
				},
			})
		);
	}

	async delete(id) {
		await dbConnect();
		return jsonify(await Status.findByIdAndDelete(id));
	}
}
