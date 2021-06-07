import nc from "next-connect";
import { all } from "../../../middlewares";
import { UserClass } from "../../../classes";

const _UserClass = new UserClass();
const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const users = await new UserClass().getAll();

		if (users) {
			res.status(200).json(users);
		} else {
			res.status(404).end();
		}
	} catch (error) {
		res.status(400).json({ success: false, error: error });
	}
});

handler.post(async (req, res) => {
	try {
		const user = req.body;
		if (!user) {
			throw "Modelo inválido";
		}

		const userCreated = await _UserClass.add(user);

		if (userCreated) {
			res.status(200).json(userCreated);
		} else {
			throw "Erro ao criar o usuário";
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, error: error });
	}
});

export default handler;
