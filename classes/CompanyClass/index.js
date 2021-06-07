import { Company } from "../../models";
import dbConnect from "../../src/dbConfig";
import { jsonify } from "../index";

export default class CompanyClass {
	constructor() {}

	async getAll() {
		await dbConnect();
		return jsonify(await Company.find({}));
	}

	async get(id) {
		await dbConnect();
		return jsonify(await Company.findById(id));
	}

	async add(data) {
		await dbConnect();
		return jsonify(await new Company(data).save());
	}

	async update(data) {
		await dbConnect();
		return jsonify(
			await Company.findByIdAndUpdate(data._id, {
				$set: {
					name: data.name,
					companyName: data.companyName,
					logo: data.logo,
					address: data.address,
					active: data.active,
				},
			})
		);
	}

	async delete(id) {
		await dbConnect();
		const company = await Company.findById(id);
		return jsonify(await Company.findByIdAndUpdate(id, { $set: { active: !company.active } })); //DELETE LÓGICO
	}
}
