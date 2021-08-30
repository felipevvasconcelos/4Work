import { TimeSheet } from "../../models";
import dbConnect from "../../src/dbConfig";
import { jsonify } from "../index";

export default class TimeSheetClass {
	constructor() {}

	async getByFilter(filter) {
		await dbConnect();
		return jsonify(await TimeSheet.find(filter));
	}

	async add(data) {
		await dbConnect();
		return jsonify(await new TimeSheet(data).save());
	}

	async update(data) {
		await dbConnect();
		return jsonify(
			await TimeSheet.findByIdAndUpdate(data._id, {
				$set: {
					description: data.description,
					date: data.date,
					user: data.user,
					project: data.project,
					improvement: data.improvement,
					call: data.call,
					hourStart1: data.hourStart1,
					hourEnd1: data.hourEnd1,
					hourStart2: data.hourStart2,
					hourEnd2: data.hourEnd2,
				},
			})
		);
	}

	async delete(id) {
		await dbConnect();
		return jsonify(await TimeSheet.findByIdAndDelete(id));
	}
}
