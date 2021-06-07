import { View } from "../../models";
import dbConnect from "../../src/dbConfig";
import { jsonify } from "../index";

export default class ViewClass {
	constructor() {}

	async getAll() {
		await dbConnect();
		return jsonify(await View.find({}));
	}

	async get(id) {
		await dbConnect();
		return jsonify(await View.findById(id));
	}

	async add(data) {
		await dbConnect();
		return jsonify(await new View(data).save());
	}

	async update(data) {
		await dbConnect();
		return jsonify(
			await View.findByIdAndUpdate(data._id, {
				$set: {
					name: data.name,
					active: data.active,
				},
			})
		);
	}

	async delete(id) {
		await dbConnect();
		return jsonify(await View.findByIdAndDelete(id));
	}
}
