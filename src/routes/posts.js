import {Router} from 'express'
import * as ctrl from '../controllers/posts.controller.js'
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { auth } from '../middlewares/auth.js';    
import { requireRole } from '../middlewares/role.js';
const r = Router()

function dummyAuth(req,_res,next){
    req.user = {id:3,role:'author'}
    next()
}
r.get('/', asyncHandler(ctrl.listPosts));
r.get('/:slug',asyncHandler(ctrl.getPost))

r.post('/',   auth,requireRole('author'), ctrl.createPost);
r.patch('/:id', auth,requireRole('author'), ctrl.updatePost);
r.delete('/:id', auth,requireRole('author'), ctrl.deletePost);
export { r as postsRouter };