import nc from "next-connect";
import { all } from "../../../middlewares";
import { ImprovementClass } from "../../../classes";

const improvementClass = new ImprovementClass();
const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const { id } = req.query;
		const result = await improvementClass.get(id);

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao buscar a melhoria.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.put(async (req, res) => {
	try {
		const result = req.body;

		const resultUpdated = await improvementClass.update(result);

		if (resultUpdated) {
			res.status(200).json(resultUpdated);
		} else {
			throw "Erro ao atualizar a melhoria.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.delete(async (req, res) => {
	try {
		const { id } = req.query;
		const result = await improvementClass.delete(id);

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao remover a melhoria.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
