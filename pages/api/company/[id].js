import nc from "next-connect";
import { all } from "../../../middlewares";
import { CompanyClass } from "../../../classes";

const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const { id } = req.query;
		const company = await new CompanyClass().get(id);

		if (company) {
			res.status(200).json(company);
		} else {
			throw "Erro ao buscar a Empresa.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error });
	}
});

handler.put(async (req, res) => {
	try {
		const company = req.body;
		const companyUpdated = await new CompanyClass().update(company);

		if (companyUpdated) {
			res.status(200).json(companyUpdated);
		} else {
			throw "Erro ao atualizar a Empresa.";
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, error: error });
	}
});

handler.delete(async (req, res) => {
	try {
		const { id } = req.query;
		const company = await new CompanyClass().delete(id);

		if (company) {
			res.status(200).json(company);
		} else {
			throw "Erro ao remover a empresa.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error });
	}
});

export default handler;
