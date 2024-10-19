import  jwt from "jsonwebtoken"
import params from "../libs/params"
import UserService from "../../application/user/UserService"

export const verifyToken = async (req, res, next) => {
    const token = req.headers['Bearer']
    const uService = new UserService()
    if(!token)
        return res.status(403).json({'success':false,msg:'No token provide'})

    const decodeJWT = jwt.verify(token, params.jwt)
    const userById = await uService.fetchById(decodeJWT.id)
    if(!userById)
        return res.status(404).json({success:false,msg:userById.msg})
    next()
}