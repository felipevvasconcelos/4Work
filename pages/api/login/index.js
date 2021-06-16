import nc from "next-connect";
import mongodb from "../../../middlewares/mongodb";
import { UserClass } from "../../../classes";
import md5 from "md5";

const _UserClass = new UserClass();
const hash = process.env.MD5HASH;

const handler = nc().use(mongodb);

handler.post(async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await _UserClass.getByFilter({ email: email, password: md5(password + hash) });

		if (user) {
			res.status(200).end();
		} else {
			res.status(401).end();
		}
	} catch (error) {
		res.status(400).json({ success: false });
	}
});

export default handler;
