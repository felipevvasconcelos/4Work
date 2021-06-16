import jwt from "next-auth/jwt";
import nc from "next-connect";
import mongodb from "../../../middlewares/mongodb";
import { UserClass } from "../../../classes";
import md5 from "md5";

const _UserClass = new UserClass();
const secret = process.env.JWT_SECRET;
const hash = process.env.MD5HASH;

const handler = nc().use(mongodb);

handler.post(async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await _UserClass.getByFilter({ email: email, password: md5(password + hash) });

		if (user) {
			var token = await jwt.auth(user, secret);
			res.status(200).send({ auth: true, token: token });
		} else {
			res.status(401).end();
		}
	} catch (error) {
		res.status(400).json({ success: false });
	}
});

export default handler;
