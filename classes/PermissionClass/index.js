import Permission from "../../models/mdlPermission";
import dbConnect from "../../src/dbConfig";
import { jsonify } from '../GlobalClass'

export default class PermissionClass {
	constructor() {}

	async getAll() {
		await dbConnect();
		return jsonify(await Permission.find().populate("view", "name").populate("profile", "name"));
	}

	async get(id) {
		await dbConnect();
		return jsonify(await Permission.findById(id).populate("view", "name").populate("profile", "name"));
	}

	async add(data) {
		await dbConnect();
		return jsonify(await new Permission(data).save().then((permission) => permission.populate("view", "name").populate("profile", "name").execPopulate()));
	}

	async update(data) {
		await dbConnect();
		return jsonify(
			await Permission.findByIdAndUpdate(data._id, {
				$set: {
					view: data.view,
					profile: data.profile,
					allowView: data.allowView,
					allowCreate: data.allowCreate,
					allowEdit: data.allowEdit,
					allowDelete: data.allowDelete,
					active: data.active,
				},
			})
				.populate("view", "name")
				.populate("profile", "name")
		);
	}

	async delete(id) {
		await dbConnect();
		return jsonify(await Permission.findByIdAndDelete(id).populate("view", "name").populate("profile", "name"));
	}
}
