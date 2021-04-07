import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import jwt from 'next-auth/jwt'

export default NextAuth({
    // pages: {
    //   signIn: '/login',
    //   newUser: '/login' // If set, new users will be directed here on first sign in
    // },
    providers: [
      // OAuth authentication providers...
    //   Providers.Apple({
    //     clientId: process.env.APPLE_ID,
    //     clientSecret: process.env.APPLE_SECRET
    //   }),
    //   Providers.Facebook({
    //     clientId: process.env.FACEBOOK_ID,
    //     clientSecret: process.env.FACEBOOK_SECRET
    //   }),
    //   Providers.Google({
    //     clientId: process.env.GOOGLE_ID,
    //     clientSecret: process.env.GOOGLE_SECRET
    //   }),
      // Passwordless / email sign in
    //   Providers.Email({
    //     server: process.env.MAIL_SERVER,
    //     from: 'NextAuth.js <no-reply@example.com>'
    //   }),
    //Microsoft
    // Providers.AzureADB2C({
    //   clientId: process.env.AZURE_CLIENT_ID,
    //   clientSecret: process.env.AZURE_CLIENT_SECRET,
    //   scope: 'offline_access User.Read',
    //   tenantId: process.env.AZURE_TENANT_ID,
    // }),
    //OAuth0
      Providers.Auth0({
        name: 'Auth0',
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        domain: process.env.AUTH0_DOMAIN
      }),

      Providers.Credentials({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'Credenciais',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
          username: { label: "E-mail", type: "text", placeholder: "" },
          password: {  label: "Senha", type: "password" }
        },

        async authorize(credentials) {
          // Add logic here to look up the user from the credentials supplied
          const user = { id: 1, email: credentials.email, password: credentials.password }
    
          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user
          } else {
            // If you return null or false then the credentials will be rejected
            return null
            // You can also Reject this callback with an Error or with a URL:
            // throw new Error('error message') // Redirect to error page
            // throw '/path/to/redirect'        // Redirect to a URL
          }
        }
      })

    ],
    
    site: process.env.NEXTAUTH_URL,
    
    session: { jwt: true },
    
    jwt: { 
      secret: process.env.JWT_SECRET,  
      encryption: true,
    },
    
    database: process.env.CONNECTION_STRING,

    callbacks:{
      
      async signIn(user, account, profile){
        
        //Valida e-mail que esta tentando logar
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({email: user.email}) })

        if(!res.ok){
          return false
        }  

      },

    },
   


  })