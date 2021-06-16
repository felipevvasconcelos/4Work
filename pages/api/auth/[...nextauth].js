import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { UserClass } from "../../../classes";
import jwt from "next-auth/jwt";
import md5 from "md5";

const hash = process.env.MD5HASH;

export default NextAuth({
	providers: [
		Providers.Credentials({
			name: "Credenciais",
			credentials: {
				username: { label: "E-mail", type: "text", placeholder: "" },
				password: { label: "Senha", type: "password" },
			},

			async authorize(credentials) {
				//Pegar o user no bd, precisa das informações de id, name, entre outras para gravar na token de sessão

				const user = await new UserClass().getByFilter({ email: credentials.username, password: md5(credentials.password + hash) });

				// const user = {
				// 	id: "1",
				// 	name: "Felipe",
				// 	email: credentials.username,
				// 	password: credentials.password,
				// };

				if (user) {
					// Any object returned will be saved in `user` property of the JWT
					return user;
				} else {
					// If you return null or false then the credentials will be rejected
					return null;
					// You can also Reject this callback with an Error or with a URL:
					// throw new Error('error message') // Redirect to error page
					// throw '/path/to/redirect'        // Redirect to a URL
				}
			},
		}),
		Providers.Email({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
		}),
		Providers.Facebook({
			clientId: process.env.FACEBOOK_ID,
			clientSecret: process.env.FACEBOOK_SECRET,
		}),
		Providers.Google({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
		//Microsoft
		Providers.AzureADB2C({
			name: "Azure Microsoft",
			clientId: process.env.AZURE_CLIENT_ID,
			clientSecret: process.env.AZURE_CLIENT_SECRET,
			scope: "offline_access User.Read",
			tenantId: process.env.AZURE_TENANT_ID,
		}),
		//OAuth0
		// Providers.Auth0({
		// 	name: "Auth0",
		// 	clientId: process.env.AUTH0_CLIENT_ID,
		// 	clientSecret: process.env.AUTH0_CLIENT_SECRET,
		// 	domain: process.env.AUTH0_DOMAIN,
		// }),
	],
	pages: {
		signIn: "/auth/signin",
		error: "/auth/signin?error=invalidLogin",
		// newUser: '/login' // If set, new users will be directed here on first sign in
	},
	site: process.env.NEXTAUTH_URL,

	session: { jwt: true },

	jwt: {
		secret: process.env.JWT_SECRET,
		encryption: true,
	},

	database: process.env.CONNECTION_STRING,

	callbacks: {
		async signIn(user, account, profile) {
			//Valida e-mail que esta tentando logar
			const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: profile.username, password: profile.password }),
			});

			if (!res.ok) {
				return false;
			}
		},
	},
});
