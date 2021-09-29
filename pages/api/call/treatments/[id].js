import nc from "next-connect";
import { all } from "../../../../middlewares";
import { CallClass } from "../../../../classes";

const callClass = new CallClass();
const handler = nc().use(all);

handler.post(async (req, res) => {
	try {
		const { id } = req.query;
		const treatments = req.body;

		const result = await callClass.updateTreatments(id, treatments);

		if (result) {
			res.status(200).json(result);
		} else {
			throw "Erro ao buscar o chamado.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
