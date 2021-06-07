import nc from "next-connect";
import { all } from "../../../middlewares";
import { UserClass } from "../../../classes";

const _UserClass = new UserClass();
const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const { id } = req.query;
		const user = await _UserClass.get(id);

		if (user) {
			res.status(200).json({ user });
		} else {
			res.status(401).end();
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error });
	}
});

handler.put(async (req, res) => {
	try {
		const { id } = req.query;
		const user = req.body;

		const userUpdated = await _UserClass.update(user);

		if (userUpdated) {
			res.status(200).json(userUpdated);
		} else {
			throw "Erro ao atualizar o usuário";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error });
	}
});

handler.delete(async (req, res) => {
	try {
		const { id } = req.query;
		const userDeleted = await _UserClass.delete(id);

		if (userDeleted) {
			res.status(200).json(userDeleted);
		} else {
			throw "Erro ao deletar o usuário";
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error });
	}
});

export default handler;
