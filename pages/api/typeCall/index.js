import nc from "next-connect";
import { all } from "../../../middlewares";
import { TypeCallClass } from "../../../classes";

const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const result = await new TypeCallClass().getAll();

		if (result) {
			res.status(200).json(result);
		} else {
			res.status(404).end();
		}
	} catch (error) {
		res.status(400).json({ success: false });
	}
});

handler.post(async (req, res) => {
	try {
		const body = req.body;
		if (!body) {
			throw "Modelo inválido";
		}

		const result = await new TypeCallClass().add(body);

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao cadastrar um novo tipo de chamado.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
