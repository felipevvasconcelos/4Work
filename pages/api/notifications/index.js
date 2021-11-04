import nc from "next-connect";
import { all } from "../../../middlewares";
import { ImprovementClass } from "../../../classes";

const improvementClass = new ImprovementClass();
const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const result = await improvementClass.getAll();

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

		const result = await improvementClass.add(body);

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao cadastrar uma nova melhoria.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
