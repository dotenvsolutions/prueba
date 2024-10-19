import { PrismaClient } from "@prisma/client";
import params from "../../infraestructure/libs/params";
import { Utilities } from "../../infraestructure/libs/Utilities";
import jwt from 'jsonwebtoken'

export default class UserRepository {
    constructor() {
        this.prisma = new PrismaClient()
    }
  
    async store(data) {
        const {username,password, email,names, lastnames,dni,birthday,movil,line,address} = data
        
        try {
            
            const user = await this.prisma.Usuarios.findUnique({
                'where': { 
                    'Mail': email 
                },
            })

            if(user){
                return  {'success':false,'msg':'Usuario previamente registrado'}
            }
             
            const newUser = await this.prisma.Usuarios.create({
                'data': {
                    'Username': username,
                    'Password': password,
                    'Mail': email,
                    'Status': 'A',
                    'personas': {
                        'create': {
                            'Nombres': names,
                            'Apellidos': lastnames,
                            'Identificacion': dni,
                            'FechaNacimiento': !birthday ? null : new Date(birthday),
                            'Movil': !movil ? null : movil,
                            'Fijo': !line ? null : line,
                            'direccion': !address ? null : address
                        }
                    },
                    "roles": {
                        'create': {
                            'rolId': 2
                        }
                    }
                }
            })

            if(!newUser){
                return {'success':false, msg:'No se ha podido crear el nuevo usuario'}
            }
    
            const jwToken = jwt.sign({id:newUser.id},params.jwt_secret,{
                expiresIn:86400
            })

            return {'success':true, 'msg': 'Usuario creado con exito', 'token': jwToken};
        } catch (error) {
            return { success: false, msg: error.message };
        }

        
    }

    async loginUser(user) {
        try {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);   

            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999)

            const verifySession = await this.prisma.Sessions.count({
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
                return {'success':false,'msg':'Usuario ya posee una sesion iniciada'} 
            }
            const registerSesionUser = await this.prisma.Sessions.create({
                'data': {
                    'FechaIngreso': new Date(),
                    'userId': user.idUsuario
                }
            })

            const jwToken = jwt.sign({id:user.id},params.jwt_secret,{
                expiresIn:86400
            })

            if(!registerSesionUser)
                return {'success':false,'msg':'No se ha podido iniciar sesion'} 

            return {'success':true, 'msg': 'Sesion Iniciada', 'token':jwToken}
        } catch (error) {
            return { success: false, msg: error.message };
        }
    }

    async fetchByEmailOrUsername(email, username) {
        try {
            const user = await this.prisma.Usuarios.findFirst({
                'where': { 
                    'OR': [
                        {'Mail': email },
                        {'Username': username}
                    ]
                },
            })
            
            if(!user){
                return false
            }
            return user;
        } catch (error) {
            //console.log(error)
            return false;
        }
        
    }

    async updateAttemptsOnLogin(data) {
        try {
            const user = await this.prisma.Usuarios.update({
                'where': { 
                    'id': parseInt(data,id),
                    'data': {
                        'attempts': data.attempts,
                        'Status': data.Status
                    }
                },
            })
            if(!user){
                return false
            }
            return user
        } catch (error) {
            return false;
        }
    }

    async delUser(id) {
        try {
            const deleteUser = await this.prisma.Usuarios.delete({
                where: {
                    id: parseInt(id)
                },
            })
            if(!deleteUser){
                return {'success':false,'msg':'No se han podido eliminar el usuario'} 
            }

            return {'success':true,'msg':'Usuario eliminado con exito'} 
        } catch (error) {
            return { success: false, msg: error.message };
        }
    }
}