import nc from "next-connect";
import { all } from "../../../../middlewares";
import TimeSheetClass from "../../../../classes/TimeSheetClass";

const timesheetClass = new TimeSheetClass();
const handler = nc().use(all);

handler.post(async (req, res) => {
	try {
		const body = req.body;
		if (!body) {
			throw "Modelo inválido";
		}

		const result = await timesheetClass.getByFilter(body);

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao buscar os lançamentos.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
