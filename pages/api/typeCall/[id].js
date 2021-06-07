import nc from "next-connect";
import { all } from "../../../middlewares";
import { TypeCallClass } from "../../../classes";

const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const { id } = req.query;
		const result = await new TypeCallClass().get(id);

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao buscar o tipo de chamado.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.put(async (req, res) => {
	try {
		const result = req.body;
		const resultUpdated = await new TypeCallClass().update(result);

		if (resultUpdated) {
			res.status(200).json(resultUpdated);
		} else {
			throw "Erro ao atualizar o tipo de chamado.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.delete(async (req, res) => {
	try {
		const { id } = req.query;
		const result = await new TypeCallClass().delete(id);

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao remover um tipo de chamado.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
