import bcrypt from 'bcryptjs'
import dayjs from 'dayjs'
import {prisma} from '../config/prismaClient.js';
import { signAccessToken, generateRefreshToken, refreshExpiryDays } from '../config/jwt.js';
import e from 'express';


export const AuthService = {


    async refresh(oldToken) {
    },
    async signup(email,plain){
        const hash = await bcrypt.hash(plain,10)
        return prisma.user.create({data:{email,password:hash}})
    },
    async login(email,plain){
        const user = await prisma.user.findUnique({where: {email:email}})
        if (!user || !await bcrypt.compare(plain, user.password))
            throw new Error('Invalid credentials')
        const access = signAccessToken({sub:user.id,role:user.role})
        const refresh = generateRefreshToken()
        await prisma.refreshToken.create({
            data:{
                token:refresh,
                expiresAt:dayjs().add(refreshExpiryDays,'day').toDate(),
                userId:user.id
            }
        })
        return {access,refresh}
    },
    async logout(token){
        await prisma.refreshToken.updateMany({
            where:{token},
            data:{revoked:true}
        })
    }, 
    async refresh(oldToken){
        const rec = await prisma.refreshToken.findUnique({where:{token:oldToken}})
        if(!rec || rec.revoked || rec.expiresAt < new Date()){
            throw new Error('Invalid refresh token')
        }
        await prisma.refreshToken.update({where: {token:oldToken},data:{revoked:true}})
        const user = await prisma.user.findUnique({where:{id:rec.userId}})
        const access = signAccessToken({sub:user.id,role:user.role})
        const refresh = generateRefreshToken()

        await prisma.refreshToken.create({
            data: {
              token: refresh,
              expiresAt: dayjs().add(refreshExpiryDays, 'day').toDate(),
              userId: user.id,
            }
          });
        return { access, refresh };
    }
}
