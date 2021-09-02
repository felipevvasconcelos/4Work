import nc from "next-connect";
import { all } from "../../../middlewares";
import { ImprovementClass } from "../../../classes";

const classe = new ImprovementClass();
const handler = nc().use(all);

handler.post(async (req, res) => {
	try {
		const { filter, fields } = req.body;
		if (!filter) {
			throw "Filtro inválido";
		}

		const result = await classe.getByFilter(filter, fields);

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao buscar os projetos.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
