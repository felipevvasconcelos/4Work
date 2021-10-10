import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { UserClass, PermissionClass } from "../../../classes";
import { createTransport } from "nodemailer";
import { emailLogin, titleEmailLogin } from "../../../src/templates";

const userClass = new UserClass();
const permissionClass = new PermissionClass();

export default NextAuth({
	providers: [
		// Providers.Credentials({
		// 	name: "Credenciais",
		// 	credentials: {
		// 		username: { label: "E-mail", type: "text", placeholder: "" },
		// 		password: { label: "Senha", type: "password" },
		// 	},

		// 	async authorize(credentials) {
		// 		const user = await userClass.getByFilter({ email: credentials.username, password: md5(credentials.password + hash), active: true });
		// 		const permissionClass = new PermissionClass();
		// 		const screns = await permissionClass.getAll();
		// 		const data = { ...user[0], screns };
		// 		if (user) {
		// 			return Promise.resolve(data);
		// 		} else {
		// 			return Promise.resolve(null);
		// 		}
		// 	},
		// }),
		Providers.Email({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
			async sendVerificationRequest({ identifier: email, url, provider: { server, from } }) {
				const { host } = new URL(url);
				const transport = createTransport(server);
				await transport.sendMail({
					to: email,
					from,
					subject: `Entrar no ${host}`,
					text: titleEmailLogin({ url, host }),
					html: emailLogin({ url, host, email }),
				});
			},
		}),
		Providers.Google({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
		//Microsoft
		Providers.AzureADB2C({
			name: "Azure Microsoft",
			tenantName: process.env.AZURE_AD_B2C_TENANT_NAME,
			clientId: process.env.AZURE_AD_B2C_CLIENT_ID,
			clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET,
			primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
			scope: `offline_access openid User.Read`,
		}),
	],
	pages: {
		signIn: "/auth/signin",
		error: "/auth/signin?error=invalidLogin",
		verifyRequest: "/auth/verify-request",
	},
	database: process.env.CONNECTION_STRING,
	site: process.env.NEXTAUTH_URL,
	session: { jwt: true },
	jwt: {
		secret: process.env.JWT_SECRET,
		encryption: true,
	},
	debug: true,
	callbacks: {
		async signIn(user, account, profile, isNewUser) {
			//Valida e-mail que esta tentando logar
			let email = "";

			switch (account.provider) {
				case "google":
					email = profile.email;
					break;
				case "azure-ad-b2c":
					email = profile.mail;
					break;
				default:
					email = profile.email;
					break;
			}

			const dbUser = await userClass.getByFilter({ email: email, active: true });

			if (Array.from(dbUser).length <= 0) {
				return false;
			}
		},
		async session(session, token) {
			session.accessToken = token.accessToken;
			return session;
		},
		async redirect({ url, baseUrl }) {
			return baseUrl;
		},
		async jwt(token, user, account, profile, isNewUser) {
			if (user) {
				let email = "";
				switch (account.provider) {
					case "google":
						email = profile.email;
						break;
					case "azure-ad-b2c":
						email = profile.mail;
						break;
					default:
						email = profile.email;
						break;
				}

				const dbUser = await userClass.getByFilter({ email: email, active: true });
				const screns = await permissionClass.getAll();
				user = { ...dbUser[0], screns };

				token.user = {
					_id: user._id,
					name: user.name,
					username: user.email,
					profile: user.profile,
					screenPermission: user.screns,
				};
			}
			return Promise.resolve(token);
		},
		async session(session, user, sessionToken) {
			session.user = user.user;
			return Promise.resolve(session);
		},
	},
});
