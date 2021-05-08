import nc from "next-connect";
import { all } from "../../../middlewares";
import { ProfileTypeClass } from "../../../classes";

const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const { id } = req.query;
		const profile = await new ProfileTypeClass().get(id);

		if (profile) {
			res.status(200).json(profile);
		} else {
			throw "Erro ao buscar o perfil.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.put(async (req, res) => {
	try {
		const profile = req.body;
		console.log(profile);
		const profileUpdated = await new ProfileTypeClass().update(profile);

		if (profileUpdated) {
			res.status(200).json(profileUpdated);
		} else {
			throw "Erro ao atualizar o perfil.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.delete(async (req, res) => {
	try {
		const { id } = req.query;
		const profile = await new ProfileTypeClass().delete(id);

		if (profile) {
			res.status(200).json(profile);
		} else {
			throw "Erro ao remover um perfil.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
