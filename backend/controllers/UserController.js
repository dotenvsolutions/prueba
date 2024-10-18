import { PrismaClient } from "@prisma/client";
import { Utilities } from "../libs/Utilities";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient()

const UserController = {
    'loginUser': async(req, res) => {
        try {
            const {email, password} = req.body
            const user = await prisma.Usuarios.findUnique({
                'where': {
                    'Mail':email 
                }
            })
            if(!user){
                res.status(401).json({'success':false,'data':'Usuario no esta registrado'})
                return;
            }
            const comparePassword = await Utilities.comparePassword(password, user.Password)
            if(!comparePassword){
                return res.status(401).json({'success':false,'data':'Password does not match'})
            }

            const registerSesionUser = await prisma.Usuarios.create({
                'data': {
                    'sesiones': {
                        'created': {
                            'FechaIngreso': new Date(now())
                        }
                    }
                }
            })

            const jwToken = jwt.sign({id:user.id},params.jwt_secret,{
                expiresIn:86400
            })

            if(!registerSesionUser)
                return res.status(401).json({'success':false,'msg':'No se ha podido iniciar sesion'})

            res.json({'success':true, 'msg': 'Sesion Iniciada', 'token':jwToken})
        } catch (error) {
            res.status(401).json({'success':false,'data':error})
        }

    },
    'fetAll': async (req, res) => {
        res.json({'success': true})
    },
    'store': async (req, res) => {
        try {
            const {username,password, email,names,lastnames, dni, birthday, phone1,phone2,address} = req.body
            let newEmail 

            if(!email){
                newEmail = Utilities.validateEmail(names,lastnames,'@gmail.com')
            }else{
                newEmail = email
            }

            
            const user = await prisma.Usuarios.findUnique({
                'where': { 
                    'Mail': newEmail 
                },
            })

            if(user){
                return res.status(401).json({'success':false,'msg':'Usuario previamente registrado'})
            }

            const userNames = await prisma.Usuarios.findMany({
                'select': {
                    'Username': true, 
                },
            })

            if(!Utilities.validateUserName(username, userNames).success){
                return res.status(401).json({'success':false,'msg':Utilities.validateUserName(username, userNames).msg})
            }

            if(!Utilities.validatePassword(password).success){
                return res.status(401).json({'success':false,'msg':Utilities.validatePassword(password).msg})
            }

            if(!Utilities.validateDNI(dni).success){
                return res.status(401).json({'success':false,'msg':Utilities.validateDNI(dni).msg})
            }
            

            const newUser = await prisma.Usuarios.create({
                'data': {
                    'Username': username,
                    'Password': Utilities.encrypUserPassword(password),
                    'Mail': newEmail,
                    'Status': 'Y',
                    'personas': {
                        'create': {
                            'Nombres': names,
                            'Apellidos': lastnames,
                            'Identificacion': dni,
                            'FechaNacimiento': !birthday ? "" : new Date(birthday),
                            'Movil': !phone1 ? "" : phone1,
                            'Fijo': !phone2 ? "" : phone2,
                            'direccion': !address ? "" : address
                        }
                    }
                }
            })

            res.json({'success':true, 'msg': 'Clientes creados con exito'})
        } catch (error) {
            console.log(error)
            res.status(401).json({'success':false,'data':error})
        }
    }
}

export default UserController