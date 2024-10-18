import { PrismaClient } from "@prisma/client";
import { Utilities } from "../libs/Utilities";
import params from "../libs/params";
import jwt from 'jsonwebtoken';
import { ViewEntity } from "typeorm";

const prisma = new PrismaClient()

const UserController = {
    'loginUser': async(req, res) => {
        try {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);   

            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999)

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
            const verifySession = await prisma.Sessions.count({
                'where': {
                    'AND': [
                        {
                            'userId':user.idUsuario
                        },
                        {
                            'FechaIngreso': {
                                gte: startOfToday,
                                lt: new Date(endOfToday.getTime() + 1),
                            }
                        }
                    ]
                }
            })

            if(parseInt(verifySession)>1){
                return res.status(403).json({'success':false,'msg':'Usuario ya ha ingresado al sistema'})
            }

            const registerSesionUser = await prisma.Sessions.create({
                'data': {
                    'FechaIngreso': new Date(),
                    'userId': user.idUsuario
                }
            })

            const jwToken = jwt.sign({id:user.id},params.jwt_secret,{
                expiresIn:86400
            })

            if(!registerSesionUser)
                return res.status(401).json({'success':false,'msg':'No se ha podido iniciar sesion'})

            res.json({'success':true, 'msg': 'Sesion Iniciada', 'token':jwToken})
        } catch (error) {
            console.log(error)
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
            
           // console.log(Utilities.encrypUserPassword(password))
            const newUser = await prisma.Usuarios.create({
                'data': {
                    'Username': username,
                    'Password': await Utilities.encrypUserPassword(password),
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
                    },
                    "roles": {
                        'create': {
                            'rolId': 2
                        }
                    }
                }
            })

            const jwToken = jwt.sign({id:newUser.id},params.jwt_secret,{
                expiresIn:86400
            })


            res.json({'success':true, 'msg': 'Clientes creados con exito', 'token': jwToken})
        } catch (error) {
            console.log(error)
            res.status(401).json({'success':false,'data':error})
        }
    },
    'update': async(req, res) => {
        try {
            let id = req.params.id;
            const findUser = await prisma.Usuarios.find.findFirst({
                'where':{
                    'idUsuario': parseInt(id)
                }
            })
            if(!findUser){
                res.status(401).json({'success':false,'msg':'Usuario no encontrado'})
            }

            const {names,lastnames, dni, birthday, phone1,phone2,address} = req.body
            
            const updatePersona = await prisma.Persona.update({
                'where': {
                    'userId':parseInt(id)
                },
                'data': {
                    'Nombres': names,
                    'Apellidos': lastnames,
                    'Identificacion': dni,
                    'FechaNacimiento': !birthday ? "" : new Date(birthday),
                    'Movil': !phone1 ? "" : phone1,
                    'Fijo': !phone2 ? "" : phone2,
                    'direccion': !address ? "" : address
                }
            })

            if(!updatePersona){
                res.status(401).json({'success':false,'msg':'No se han podido actualizar datos de Perfil'})
            }

            res.json({'success':true,'msg':'Usuario Actualizado con exito'})
        } catch (error) {
            console.log(error)
            res.status(403).json({'success':false,'data':error})
        }
    },
    'delete': async(req, res) => {
        try {
            let id = req.params.id;
            const deleteUser = await prisma.user.delete({
                where: {
                    id: parseInt(id)
                },
            })
            if(!deleteUser){
                res.status(401).json({'success':false,'msg':'No se han podido eliminar el usuario'})
            }

            res.json({'success':true,'msg':'Usuario Actualizado con exito'})
        } catch (error) {
            
        }
    }
}

export default UserController