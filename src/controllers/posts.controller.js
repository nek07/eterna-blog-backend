import {prisma} from '../config/prismaClient.js'
import {getUniqueSlug} from '../services/slugify.js'

export async function listPosts(req,res){
    const page = Number(req.query.page ?? 1)
    const limit = Number(req.query.limit ?? 10)
    const skip = (page - 1) * limit


    const [items, total] = await Promise.all([
        prisma.post.findMany({
            skip,
            take: limit,
            orderBy: {createdAt:'desc'},
            include: {author: {select: {id:true,email:true}}},}),
            prisma.post.count(),
    ]);
    res.json({page,totalPages: Math.ceil(total/limit),items})
}

export async function createPost(req,res){
    const {title, contentMarkdown, coverUrl,excerpt, tags = []} = req.body;
    if (!title || !contentMarkdown)
        return res.status(400).json({message: 'title and contentMarkdown required'})
    const slug = await getUniqueSlug(title)
    const post = await prisma.post.create({
        data:{
            title,
            slug,
            coverUrl,
            excerpt,
            contentMarkdown,
            tags,
            authorId: req.user.id,
        },

    })
    res.status(200).json(post)
}

export async function updatePost(req,res){
    const id = Number(req.params.id)
    const {
        title, contentMarkdown, excerpt, coverUrl, tags,
    } = req.body
    const isExisting = await prisma.post.findUnique({where:{id}})
    if (!isExisting) return res.status(400).json({message:'Not Found'})
    if (isExisting.authorId !== req.user.id)
        return res.status(403).json({message:'Forbidden'})

    const data = {}
    if(title) {
        data.title = title
        data.slug = await getUniqueSlug(title);
    }
    if(contentMarkdown) data.contentMarkdown=contentMarkdown
    if(coverUrl!==undefined) data.coverUrl=coverUrl
    if(excerpt!==undefined) 
        data.excerpt=excerpt || (contentMarkdown ?? isExisting.contentMarkdown).slice(0,160)
    if(tags !== undefined) data.tags = tags
    
    const post = await prisma.post.update({where:{id},data})
    res.status(200).json(post)

}
export async function deletePost(req,res){
    const id = Number(req.params.id);
    const isExisting = await prisma.post.findUnique({where:{id}})
    if(!isExisting) 
        return res.status(404).json({message:"Not Found"})
    if (isExisting.authorId !== req.user.id)
        return res.status(403).json({message:"Forbidden"})
    await prisma.post.delete({where:{id}})
    res.status(204).end()

}

export async function getPost(req,res){
    try{
    const post = await prisma.post.findUniqueOrThrow(
        {where:{slug:req.params.slug}, 
        include: { author: { select: { id: true, email: true } 
    }}})
    res.json(post)
    }catch (err){
    if(err.code === 'P2025')
        return res.status(404).json({message:'Not Found'})
    next(err);
    }
}