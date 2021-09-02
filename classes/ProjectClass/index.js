import { Schema } from "mongoose";
import { Project } from "../../models";
import dbConnect from "../../src/dbConfig";
import { jsonify } from "../index";

export default class ProjectClass {
	constructor() {}

	async getAll() {
		await dbConnect();
		return jsonify(await Project.find().populate("company", "name").populate("user", "name").populate("status", "name"));
	}

	async get(id) {
		await dbConnect();
		return jsonify(await Project.findById(id));
	}

	async getByFilter(data) {
		await dbConnect();

		if (data) {
			return jsonify(await Project.find(data).populate("company", "name").populate("user", "name").populate("status", "name"));
		} else {
			return jsonify(await Project.find().populate("company", "name").populate("user", "name").populate("status", "name"));
		}
	}

	async add(data) {
		await dbConnect();
		return jsonify(await new Project(data).save().then((project) => project.populate("companies", "name").populate("users", "name").populate("status", "name").execPopulate()));
	}

	async update(data) {
		await dbConnect();
		return jsonify(
			await Project.findByIdAndUpdate(data._id, {
				$set: {
					name: data.name,
					status: data.status,
					company: data.company,
					includeUsers: data.includeUsers,
					hoursDevelopment: data.hoursDevelopment,
					hoursHomologation: data.hoursHomologation,
					hoursDeploy: data.hoursDeploy,
					hoursDocumentation: data.hoursDocumentation,
					hoursGathering: data.hoursGathering,
					hoursInteraction: data.hoursInteraction,
					hoursManagement: data.hoursManagement,
					priceCalculated: data.priceCalculated,
					priceCharged: data.priceCharged,
					dateStart: data.dateStart,
					dateEnd: data.dateEnd,
					dateCreate: data.dateCreate,
					dateModified: data.dateModified,
					userCreate: data.userCreate,
					userModified: data.userModified,
				},
			})
				.populate("companies", "name")
				.populate("user", "name")
				.populate("status", "name")
		);
	}

	async delete(id) {
		await dbConnect();
		return jsonify(await Project.findByIdAndDelete(id).populate("companies", "name").populate("users", "name").populate("status", "name"));
	}
}
