import bcrypt from 'bcryptjs'

export default class User {
    constructor(username, password, email, name, lastname,dni, birthday, movil, line, address) {
      this.username = username;
      this.password = password;
      this.email = email;
      this.names = name;
      this.lastname = lastname
      this.dni = dni;
      this.birthday = birthday;
      this.movil = movil;
      this.line = line;
      this.address = address
    }

    validateEmail(server) {
      const cleanName = this.names.toLowerCase().split(' ').join('');
      const clearLastname = this.lastname.toLowerCase().split(' ').join('');

      let getFirstCharacterName = cleanName.charAt(0)

      const config = [
        `${getFirstCharacterName}${clearLastname}`,           
        `${cleanName}${clearLastname}`,            
        `${cleanName.split(' ')[0]}${clearLastname}`  
      ];
      if(server.startsWith('@')){
        server = server.slice(1)
      }

      let selected = config[Math.floor(Math.random() * config.length)];
      if(typeof server === null || typeof server === 'undefined' || !server){
        server = '@gmail.com'
      }
      return `${selected}@${server}`;
    }
    
    validateUserName() {
      const validateSigns = /^[A-Za-z0-9]+$/;
        const validateMayusculas = /[A-Z]/;
        const validateNumbers = /[0-9]/;

        /*if(pool.includes(this.name)){
            return {'success': false,'msg':'Nombre de usuario previamente registrado'};
        }*/
    
        if(!validateSigns.test(this.username)){
            return {'success': false,'msg':'El nombre de usuario no debe contener caracteres especiales'}
        }
        
        if(!validateMayusculas.test(this.username)){
            return {'success':false, 'msg': 'El nombre de usuario debe contener al menos una mayuscula'}
        }

        if(!validateNumbers.test(this.username)){
            return {'success':false,'msg': 'El nombre de usuario debe contener al menos un numero'}
        }

        if (this.username.length < 8 || this.username.length > 20) {
            return {'success':false, 'msg': 'El nombre de usuario debe contener un minimo de 8 caracteres y un maximo de 20'}
        }
        
        return {'success': true, 'msg': ''};
    }

    validatePassword() {
      const validateSigns = /[!@#$%^&*(),.?":{}|<>]/;
        const validateMayusculas = /[A-Z]/;

        if (/\s/.test(this.password)) {
            return {'success':false, 'msg': 'La contraseña no debe contener espacios en blanco'}
        }

        if(!validateMayusculas.test(this.password)){
            return {'success':false, 'msg': 'La contraseña debe contener al menos una mayuscula'}
        }

        if (this.password.length < 8 ) {
            return {'success':false, 'msg': 'La contraseña de usuario debe ser al menos de 8 digitos'}
        }

        if(!validateSigns.test(this.password)){
            return {'success': false,'msg':'La contraseña debe contener al menos uno de estos caracteres (@,#,$,!) etc.'}
        }

        return {'success': true, 'msg': ''};
    }

    validateDNI() {
      const validateNumbers = /^[0-9]+$/;
        const validatePetitedDigits = /(.)\1{3,}/
        
        if (this.dni.length < 10 ) {
            return {'success':false, 'msg': 'La identificacion debe ser de al menos 10 numeros'}
        }

        if(!validateNumbers.test(this.dni)){
            return {'success':false,'msg': 'La identificacion deben ser solo numeros'}
        }

        if(validatePetitedDigits.test(this.dni)){
            return {'success':false,'msg': 'La identificacion no debe contener mas de 3 digitos iguales consecutivos '}
        }

        return {'success': true, 'msg': ''};
    }

    async encrypUserPassword() {
      const salt = await bcrypt.genSalt(10)
      return await bcrypt.hash(this.password, salt)
    }

    async comparePassword(userPassword) {
      return await bcrypt.compare(this.password, userPassword)
    }

}