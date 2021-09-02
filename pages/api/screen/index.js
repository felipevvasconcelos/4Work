import nc from "next-connect";
import { all } from "../../../middlewares";
import { ViewClass } from "../../../classes";

const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const views = await new ViewClass().getAll();

		if (views) {
			res.status(200).json(views);
		} else {
			res.status(404).end();
		}
	} catch (error) {
		res.status(400).json({ success: false });
	}
});

handler.post(async (req, res) => {
	try {
		const view = req.body;
		if (!view) {
			throw "Nome de Tela inválido";
		}

		const newView = await new ViewClass().add(view);

		if (newView) {
			res.status(200).json(newView);
		} else {
			throw "Erro ao cadastrar uma nova tela.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
