import { User } from "../../models";
import dbConnect from "../../src/dbConfig";
import { jsonify } from "../index";

export default class UserClass {
	constructor() {
		this.User = User;
	}

	async getUserById(id) {
		await dbConnect();
		if (id) {
			return jsonify(await this.User.findById(id));
		} else {
			return false;
		}
	}

	async getUsers() {
		await dbConnect();
		return jsonify(await this.User.find({}));
	}
}
