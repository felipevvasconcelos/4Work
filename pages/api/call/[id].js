import nc from "next-connect";
import { all } from "../../../middlewares";
import { CallClass } from "../../../classes";

const callClass = new CallClass();
const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const { id } = req.query;
		const result = await callClass.get(id);

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao buscar o chamado.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.put(async (req, res) => {
	try {
		const result = req.body;

		const resultUpdated = await callClass.update(result);

		if (resultUpdated) {
			res.status(200).json(resultUpdated);
		} else {
			throw "Erro ao atualizar o chamado.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.delete(async (req, res) => {
	try {
		const { id } = req.query;
		const result = await callClass.delete(id);

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao remover o chamado.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
