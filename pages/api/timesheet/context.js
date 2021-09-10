import nc from "next-connect";
import { all } from "../../../middlewares";
import { TimeSheetClass } from "../../../classes";

const timesheetClass = new TimeSheetClass();
const handler = nc().use(all);

handler.get("/getPending/:userId", (async (req, res) => {
  try {
    const _id = req.params.userId;
		const result = await timesheetClass.getByFilter({ user: _id, timeEnd: null  });

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao buscar o timesheet pendente.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
}))

handler.get("/getTimesheet/:timeStart/:timeEnd/:userId", (async (req, res) => {
  try {

    const timeStart = req.params.timeStart;
    const timeEnd = req.params.timeEnd;
    const _id = req.params.userId;

		const result = await timesheetClass.getByFilter({ timeStart, timeEnd, user: _id });

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao buscar o timesheet.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
}))