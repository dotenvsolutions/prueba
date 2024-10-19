import  jwt from "jsonwebtoken"
import params from "../libs/params"
import UserService from "../../application/user/UserService"

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization']
        let cleanToken = token.replace('Bearer ', '');
        const uService = new UserService()
        if(!cleanToken)
            return res.status(403).json({'success':false,msg:'No token provide'})

        const decodeJWT = jwt.verify(cleanToken, params.jwt_secret)
        req.idUsuario = decodeJWT.id
        const userById = await uService.fetchById(decodeJWT.id)
        if(!userById)
            return res.status(404).json({success:false,msg:userById.msg})
        next()
    } catch (error) {
        return res.status(401).json({success:false,msg:'Acceso NO autorizado'})
    }
}

export const isAdmin = async (req, res, next) => {
    const userById = await uService.fetchDataUserById(req.idUsuario)
}