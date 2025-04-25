export function requireRole(...allowedRoles){
    return(req,res,next) => {
        const {role} = req.user ?? {};
        if(!role || !allowedRoles.includes(role)){
            return res.status(403).json({message:'Forbidden: insufficient role'})

        }
        next();
    }
}