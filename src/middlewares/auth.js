import { verifyAccessToken } from "../config/jwt.js";

export function auth(req,res,next){
    const h = req.headers.authorization || '';
    const [,token] = h.split(' ')
    if(!token) 
        return res.status(401).json({message:'No token'})
    try {
        const {sub:userId,role} = verifyAccessToken(token)
        req.user = {id: userId,role}
        next()

    }catch {
        return res.status(401).json({message:'Invalid token'})
    }
}