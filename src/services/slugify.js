import slugify from 'slugify'
import {prisma} from '../config/prismaClient.js'

export async function getUniqueSlug(title){
    const base=slugify(title,{lower:true,strict:true})
    let slug = base
    let i = 1

    while (await prisma.post.findUnique({where: {slug}})){
        slug = `${base}-${i++}`
        
    }
    return slug
}