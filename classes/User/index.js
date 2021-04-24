import { User } from "../../models";
import dbConnect from "../../src/dbConfig";

export default class UserClass {
	constructor() {
		this.User = User;
	}

	async getUserById(id) {
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

function jsonify(obj) {
	return JSON.parse(JSON.stringify(obj));
}
