import { PrismaClient } from "@prisma/client";
import params from "../../infraestructure/libs/params";
import { Utilities } from "../../infraestructure/libs/Utilities";
import jwt from 'jsonwebtoken'

export default class UserRepository {
    constructor() {
        this.prisma = new PrismaClient()
    }
    
    async fetchAll() {
        try {
            const result = await this.prisma.$queryRaw`
                SELECT * FROM getallusers();
            `;
            return {'success':true, 'data': result};
        } catch (error) {
            return { success: false, msg: error.message };
        }
    }

    async fetUserById(id){
        try {
            const user = await this.prisma.Usuarios.findFirst({
                'where': { 
                    'idUsuario': parseInt(id)
                },
            })
            if(!user)
                return {success:false,msg:'Usuario no existe o recientemente eliminado'}
            return {'success':true, data: user}
        } catch (error) {
            return { success: false, msg: error.message };
        }
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

            return {'success':true, 'msg': 'Sesion Iniciada', 'token':jwToken, 'data': {
                id:user.idUsuario,
                'username':user.Username,
                name:user.personas.Nombres,
                lastname:user.personas.Apellidos,
                dni:user.personas.Identificacion,
                movil: user.personas.Movil,
                fijo: user.personas.Fijo,
                direccion:user.personas.direccion,
                'email':user.Mail,
                'rol':user.roles[0].rolId,
                'rolName':user.roles[0].RolName,
                'sessionId':registerSesionUser.idSesion
            }}
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
                        {'Username': email}
                    ]
                },
                include: {
                    roles: true,
                    personas:true
                }
                
            })

            const rol = await this.prisma.Rol.findFirst({
                'where': {
                    'idRol': parseInt(user.roles[0].rolId)
                },
                select: {
                    RolName:true
                }
            })
            
            if(!user){
                return false
            }

            user.roles[0].RolName = rol.RolName
            
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
                    'idUsuario': parseInt(data.id),
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
                    idUsuario: parseInt(id)
                },
            })

            if(!deleteUser){
                return {'success':false,'msg':'No se han podido eliminar el usuario'} 
            }

            return {'success':true,'msg':'Usuario eliminado con exito'} 
        } catch (error) {
            console.log(error)
            return { success: false, msg: error.message };
        }
    }

    async updateUser(id, nombre,lastname,dni,movil,fijo,direccion, rol) {
        try {
            const roles = await this.prisma.Rol_usuarios.update({
                'where': { 
                    userId_rolId: {
                        userId: parseInt(id),  // Aquí pones el ID del usuario
                        rolId:parseInt(rol)    // Aquí pones el ID del rol
                    }
                    
                },
                'data': {
                    'rolId': parseInt(rol),
                }
            })
    
            const user = await this.prisma.Persona.update({
                'where': { 
                    'userId': parseInt(id)
                },
                'data': {
                    'Nombres': nombre,
                    'Apellidos': lastname,
                    'Identificacion': dni,
                    'Movil': movil,
                    'Fijo': fijo,
                    'direccion': direccion
                }
            })
    
            if(!user||!roles){
                return {'success':false, msg:'No se ha podido actualizar datos del usuario'}
            }
    
            return {'success':true, 'msg': 'Usuario actualizado con exito'};
        } catch (error) {
            console.log(error)
            return { success: false, msg: error.message };
        }
    }

    async logOutUser(id,sessionId){
        try {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);   

            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999)

            const user = await this.prisma.Sessions.update({
                'where': { 
                    'userId': parseInt(id),
                    'idSesion': parseInt(sessionId)
                },
                'data': {
                        'FechaCierre': new Date()
                    }
            })
            if(!user){
                return {'success':false,'msg':'No se ha podido registrar la salida'} 
            }
            return {'success':true,'msg':'usuario finalizo su sesion correctamente'} 
        } catch (error) {
            console.log(error)
            return { success: false, msg: error.message };
        }
    }

    async storeMasiveUsers(data){
        if(data.length>0){
            data.forEach(async e => {
                const checkUser =  await this.prisma.Usuarios.findUnique({
                    'where': { 
                        'Mail': e.EMAIL 
                    },
                })
                if(!checkUser){
                    const getRol = await this.prisma.Rol.findFirst({
                        where:{
                            RolName:e.ROL
                        }
                    })
                    const newUser = await this.prisma.Usuarios.create({
                        'data': {
                            'Username': e.USERNAME,
                            'Password': await Utilities.encrypUserPassword(e.PASSWORD),
                            'Mail': e.EMAIL,
                            'Status': 'A',
                            'personas': {
                                'create': {
                                    'Nombres': e.NOMBRE,
                                    'Apellidos': e.APELLIDO,
                                    'Identificacion': e.CEDULA,
                                    'Movil': e.MOVIL,
                                    'Fijo': e.FIJO,
                                    'direccion': e.DIRECCION
                                }
                            },
                            "roles": {
                                'create': {
                                    'rolId': !rol ? 1: rol.idRol
                                }
                            }
                        }
                    })
                    if(!newUser){
                        return {'success':false, msg:'No se ha podido crear el nuevo usuario: '+e.NOMBRE}
                    }
                }   
            });
            return {'success':true, 'msg': 'Usuario creado con exito' };
        }
    }
}