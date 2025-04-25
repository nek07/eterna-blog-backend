import jwt from 'jsonwebtoken'
import {v4 as uuidv4} from 'uuid'
import dotenv from 'dotenv'
dotenv.config();

const ACCESS_EXPIRES_IN = '15m'
const REFRESH_EXPIRES_IN = '7d'

export function signAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: ACCESS_EXPIRES_IN});
}
export function verifyAccessToken(token){
    return jwt.verify(token,process.env.JWT_SECRET)
}
export function generateRefreshToken(){
    return uuidv4()
}
export const refreshExpiryDays = 7