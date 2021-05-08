import { ProfileType } from "../../models";
import dbConnect from "../../src/dbConfig";
import { jsonify } from "../index";

export default class ProfileTypeClass {
	constructor() {}

	async getAll() {
		await dbConnect();
		return jsonify(await ProfileType.find({}));
	}

	async get(id) {
		await dbConnect();
		return jsonify(await ProfileType.findById(id));
	}

	async add(data) {
		await dbConnect();
		return jsonify(await new ProfileType(data).save());
	}

	async update(data) {
		await dbConnect();
		return jsonify(
			await ProfileType.findByIdAndUpdate(data._id, {
				$set: {
					name: data.name,
					active: data.active,
				},
			})
		);
	}

	async delete(id) {
		await dbConnect();
		return jsonify(await ProfileType.findByIdAndDelete(id));
	}
}
