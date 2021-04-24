import nc from "next-connect";
import { User } from "../../../models";
import { all } from "../../../middlewares";
import { UserClass } from "../../../classes";

const handler = nc().use(all);

handler.get(async (req, res) => {
	try {
		const { id } = req.query;
		const user = await new UserClass().getUserById(id);

		if (user) {
			res.status(200).json({ user });
		} else {
			res.status(404).end();
		}
	} catch (error) {
		res.status(400).json({ success: false });
	}
});

export default handler;
