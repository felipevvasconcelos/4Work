import nc from "next-connect";
import { all } from "../../../middlewares";
import { CompanyClass } from "../../../classes";

const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const companies = await new CompanyClass().getAll();

		if (companies) {
			res.status(200).json(companies);
		} else {
			res.status(404).end();
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error });
	}
});

handler.post(async (req, res) => {
	try {
		const company = req.body;
		if (!company) {
			throw "Modelo inválido";
		}

		const companyNew = await new CompanyClass().add(company);

		if (companyNew) {
			res.status(200).json(companyNew);
		} else {
			throw "Erro ao cadastrar uma nova Empresa.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error });
	}
});

export default handler;
