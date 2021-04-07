import jwt from 'next-auth/jwt'

const secret = process.env.JWT_SECRET

export default async function authenticated(req, res, next) {
    try {

        const token = await jwt.getToken({ req, secret, encryption: true })
        
        if(token){
            return next();
        }

        return res.status(401).json({success: false, message: "Token Inválido"})

    } catch (e) {
        return res.status(401).json({success: false, message: e.message})
    }
}