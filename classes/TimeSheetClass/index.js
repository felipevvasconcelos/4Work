import moment from "moment";
import { TimeSheet, Project, Improvement, Call } from "../../models";
import dbConnect from "../../src/dbConfig";
import { compareValues } from "../GlobalClass";
import { jsonify } from "../index";

export default class TimeSheetClass {
	constructor() {}

	async getByFilter(filter) {
		await dbConnect();
		return jsonify(await TimeSheet.find(filter).populate("project", "name").populate("call", "title").populate("improvement", "title"));
	}

	async getByFilterasd(filter) {
		await dbConnect();
		return jsonify(await TimeSheet.where("timeStart"));
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

	async getAppoitments(filter) {
		try {
			var appointments = jsonify(await TimeSheet.find(filter).populate("project", "name projectNumber").populate("call", "title callNumber").populate("improvement", "title improvementNumber").populate("user", "name"));

			if (!appointments) return [];

			return appointments;
		} catch (e) {
			console.log(e);
		}
	}

	async getAppoitmentObjects(filter) {
		try {
			var projectsIds = await TimeSheet.distinct("project", filter);
			var callsIds = await TimeSheet.distinct("call", filter);
			var improvementsIds = await TimeSheet.distinct("improvement", filter);

			var projects = jsonify(await Project.find({ _id: { $in: projectsIds } }));
			var calls = jsonify(await Call.find({ _id: { $in: callsIds } }));
			var improvements = jsonify(await Improvement.find({ _id: { $in: improvementsIds } }));

			var appointmentObjects = [];

			projects.map((value) => {
				appointmentObjects.push({ _id: value._id, number: value.projectNumber, name: value.name });
			});
			calls.map((value) => {
				appointmentObjects.push({ _id: value._id, number: value.callNumber, name: value.title });
			});
			improvements.map((value) => {
				appointmentObjects.push({ _id: value._id, number: value.improvementNumber, name: value.title });
			});

			return appointmentObjects;
		} catch (e) {
			console.log(e);
		}
	}

	
}
