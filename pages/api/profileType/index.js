import nc from "next-connect";
import { all } from "../../../middlewares";
import { ProfileTypeClass } from "../../../classes";

const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const profiles = await new ProfileTypeClass().getAll();

		if (profiles) {
			res.status(200).json(profiles);
		} else {
			res.status(404).end();
		}
	} catch (error) {
		res.status(400).json({ success: false });
	}
});

handler.post(async (req, res) => {
	try {
		const { name } = req.body;
		if (!name) {
			throw "Nome de Perfil inválido";
		}

		const profile = await new ProfileTypeClass().add({ name: name });

		if (profile) {
			res.status(200).json(profile);
		} else {
			throw "Erro ao cadastrar um novo perfil.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
