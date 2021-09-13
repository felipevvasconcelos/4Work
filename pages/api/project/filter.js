import nc from "next-connect";
import { all } from "../../../middlewares";
import { ProjectClass } from "../../../classes";
import mongoose from 'mongoose'

const classe = new ProjectClass();
const handler = nc().use(all);

handler.post(async (req, res) => {
	try {
		const { filter } = req.body;
		if (!filter) {
			throw "Filtro inválido";
		}
		console.log(filter);
		const result = await classe.getByFilter(filter);

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
