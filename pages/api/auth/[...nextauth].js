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
				const user = await new UserClass().getByFilter({ email: credentials.username, password: md5(credentials.password + hash), active: true });

				if (user) {
					return Promise.resolve(user[0]);
				} else {
					return Promise.resolve(null);
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
	database: process.env.CONNECTION_STRING,
	site: process.env.NEXTAUTH_URL,
	session: { jwt: true },
	jwt: {
		secret: process.env.JWT_SECRET,
		encryption: true,
	},
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
		async session(session, token) {
			session.accessToken = token.accessToken;
			return session;
		},
		jwt: async (token, user, account, profile, isNewUser) => {
			if (user) {
				token.user = {
					_id: user._id,
					name: user.name,
					username: user.email,
				};
			}
			return Promise.resolve(token);
		},
		session: async (session, user, sessionToken) => {
			session.user = user.user;
			return Promise.resolve(session);
		},
	},
});
