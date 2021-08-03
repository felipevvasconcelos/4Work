import { Position } from "../../models";
import dbConnect from "../../src/dbConfig";
import { jsonify } from "../index";

export default class PositionClass {
	constructor() {}

	async getAll() {
		await dbConnect();
		return jsonify(await Position.find());
	}

	async get(id) {
		await dbConnect();
		return jsonify(await Position.findById(id));
	}

	async getByFilter(data) {
		await dbConnect();
		return jsonify(await Position.find(data));
	}

	async add(data) {
		await dbConnect();
		return jsonify(await new Position(data).save());
	}

	async update(data) {
		await dbConnect();
		return jsonify(
			await Position.findByIdAndUpdate(data._id, {
				$set: {
					name: data.name,
					active: data.active,
				},
			})
		);
	}

	async delete(id) {
		await dbConnect();
		return jsonify(await Position.findByIdAndDelete(id));
	}
}
