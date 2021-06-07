import { TypeCall } from "../../models";
import dbConnect from "../../src/dbConfig";
import { jsonify } from "../index";

export default class TypeCallClass {
	constructor() {}

	async getAll() {
		await dbConnect();
		return jsonify(await TypeCall.find());
	}

	async get(id) {
		await dbConnect();
		return jsonify(await TypeCall.findById(id));
	}

	async add(data) {
		await dbConnect();
		return jsonify(await new TypeCall(data).save());
	}

	async update(data) {
		await dbConnect();
		return jsonify(
			await TypeCall.findByIdAndUpdate(data._id, {
				$set: {
					name: data.name,
					slaDefault: data.slaDefault,
					active: data.active,
				},
			})
		);
	}

	async delete(id) {
		await dbConnect();
		return jsonify(await TypeCall.findByIdAndDelete(id));
	}
}
