import nc from "next-connect";
import { all } from "../../../middlewares";
import { PermissionClass } from "../../../classes";

const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const { id } = req.query;
		const permission = await new PermissionClass().get(id);

		if (permission) {
			res.status(200).json(permission);
		} else {
			throw "Erro ao buscar tela.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.put(async (req, res) => {
	try {
		const permission = req.body;
		const permissionUpdated = await new PermissionClass().update(permission);
		if (permissionUpdated) {
			res.status(200).json(permissionUpdated);
		} else {
			throw "Erro ao atualizar a tela.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

handler.delete(async (req, res) => {
	try {
		const { id } = req.query;
		const permission = await new PermissionClass().delete(id);

		if (permission) {
			res.status(200).json(permission);
		} else {
			throw "Erro ao remover uma tela.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
