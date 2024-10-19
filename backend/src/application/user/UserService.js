import UserRepository from "../../domain/user/UserRepository";
import User from '../../domain/user/User'
import bcrypt from 'bcryptjs'
export default class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAll() {
        return await this.userRepository.fetchAll()
    }

    async createNewUser(username,password, email,names, lastnames,dni,birthday,movil,line,address) {
        const userData = new User(username,password, email,names, lastnames,dni,birthday,movil,line,address)
        
        if(!email){
            userData.email = userData.validateEmail('@gmail.com')
            
        }else{
            userData.email = email
        }
        
        if(!userData.validatePassword().success){
            return {'success':false,'msg':userData.validatePassword().msg}
        }

        if(!userData.validateDNI().success){
            return {'success':false,'msg':userData.validateDNI().msg}
        }

        if(!userData.validateUserName().success){
            return {'success':false,'msg':userData.validateUserName().msg}
        }

        userData.password = await userData.encrypUserPassword()
        
        return await this.userRepository.store(userData)
    }

    async loginUser(username,password, email){

        const dataUser = await this.userRepository.fetchByEmailOrUsername(email, username)
        //console.log(dataUser)
        if(!dataUser)
            return {'success': false, 'msg': 'Usuario no registrado'}
        const compare = await bcrypt.compare(password, dataUser.Password)
        if(!compare){
            dataUser.attempts += 1
            if(dataUser.attempts >= 3){
                dataUser.Status = 'I'
                dataUser.attempts = 0
                const update = await this.userRepository.updateAttemptsOnLogin(dataUser)
                if(!update){
                    return {success:false, 'msg': 'Error actualizando data de usuario'}
                }
                return {success:false, 'msg': 'Usuario suspendido ha superado el numero de intentos'}
            }else{
                const update =  await this.userRepository.updateAttemptsOnLogin(dataUser)
                if(!update){
                    return {success:false, 'msg': 'Error actualizando data de usuario'}
                }
                return {success:false, 'msg':`Password incorrecto, Intento # ${dataUser.attempts}` }
            }
        }
        dataUser.attempts = 0;
        dataUser.Status = 'A'

        return await this.userRepository.loginUser(dataUser)
    }

    async deleteUser(id) {
        return await this.userRepository.delUser(id)
    }

    async updateUser(id, username,password, rol){
        return await this.userRepository.update(id, username, password, rol)
    }
}