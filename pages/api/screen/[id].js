import nc from "next-connect";
import { all } from "../../../middlewares";
import { ViewClass } from "../../../classes";

const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const { id } = req.query;
		const view = await new ViewClass().get(id);

		if (view) {
			res.status(200).json(view);
		} else {
			throw "Erro ao buscar tela.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.put(async (req, res) => {
	try {
		const view = req.body;
		const viewUpdated = await new ViewClass().update(view);

		if (viewUpdated) {
			res.status(200).json(viewUpdated);
		} else {
			throw "Erro ao atualizar a tela.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.delete(async (req, res) => {
	try {
		const { id } = req.query;
		const view = await new ViewClass().delete(id);

		if (view) {
			res.status(200).json(view);
		} else {
			throw "Erro ao remover uma tela.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
