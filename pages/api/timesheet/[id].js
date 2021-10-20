import nc from "next-connect";
import { all } from "../../../middlewares";
import { TimeSheetClass } from "../../../classes";

const timesheetClass = new TimeSheetClass();
const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const { id } = req.query;
		const result = await timesheetClass.getByFilter({ _id: id });

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao buscar o status.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.put(async (req, res) => {
	try {
		const result = req.body;
		console.log(result)
		const resultUpdated = await timesheetClass.update(result);

		if (resultUpdated) {
			res.status(200).json(resultUpdated);
		} else {
			throw "Erro ao atualizar o status.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.delete(async (req, res) => {
	try {
		const { id } = req.query;
		const result = await timesheetClass.delete(id);

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao remover o status.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
