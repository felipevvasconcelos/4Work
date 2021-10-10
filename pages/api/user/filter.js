import nc from "next-connect";
import { all } from "../../../middlewares";
import { UserClass } from "../../../classes";

const classe = new UserClass();
const handler = nc().use(all);

handler.post(async (req, res) => {
	try {
		const { filter } = req.body;
		if (!filter) {
			throw "Filtro inválido";
		}

		const result = await classe.getByFilter(filter);

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao buscar os usuários.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
