import { User } from "../../../models";
//import dbConnect from '../../../src/dbConfig'
//import bcrypt from 'bcryptjs'
import jwt from "next-auth/jwt";
import nc from "next-connect";
import mongodb from "../../../middlewares/mongodb";

const secret = process.env.JWT_SECRET;

const handler = nc().use(mongodb);

handler.post(async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email: email });

		//if(user && (await bcrypt.compare(password, user.password))){
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
