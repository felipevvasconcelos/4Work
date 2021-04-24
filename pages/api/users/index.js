import nc from "next-connect";
import { User } from "../../../models";
import { all } from "../../../middlewares";
import { UserClass } from "../../../classes";

const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const users = await new UserClass().getUsers();

		if (users) {
			res.status(200).json(users);
		} else {
			res.status(404).end();
		}
	} catch (error) {
		res.status(400).json({ success: false });
	}
});

export default handler;
