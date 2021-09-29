import nc from "next-connect";
import { all } from "../../../../../middlewares";
import { TimeSheetClass } from "../../../../../classes";

const timesheetClass = new TimeSheetClass();
const handler = nc().use(all);

handler.post(async (req, res) => {
	try {
		const filter = req.body;

		const appointments = await timesheetClass.getAppoitments(filter);
		const appointmentsObjects = await timesheetClass.getAppoitmentObjects(filter);

		res.status(200).json({ appointments, appointmentsObjects });
	} catch (error) {
		res.status(400).json({ success: false, error: error });
	}
});

export default handler;
