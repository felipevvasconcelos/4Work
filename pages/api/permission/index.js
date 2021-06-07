import nc from "next-connect";
import { all } from "../../../middlewares";
import { PermissionClass } from "../../../classes";

const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const permissions = await new PermissionClass().getAll();

		if (permissions) {
			res.status(200).json(permissions);
		} else {
			res.status(404).end();
		}
	} catch (error) {
		res.status(400).json({ success: false });
	}
});

handler.post(async (req, res) => {
	try {
		const permission = req.body;
		if (!permission) {
			throw "Modelo inválido";
		}
		const addPermission = await new PermissionClass().add(permission);

		if (addPermission) {
			res.status(200).json(addPermission);
		} else {
			throw "Erro ao cadastrar uma nova tela.";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
});

export default handler;
