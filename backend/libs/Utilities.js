import bcrypt from 'bcryptjs'

export const Utilities = {
    'validateEmail': (name, lastname, server) => {
        const cleanName = name.toLowerCase().split(' ').join('');
        const clearLastname = lastname.toLowerCase().split(' ').join('');

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
    },
    'validateUserName': (name, pool) => {
        const validateSigns = /^[A-Za-z0-9]+$/;
        const validateMayusculas = /[A-Z]/;
        const validateNumbers = /[0-9]/;

        if(pool.includes(name)){
            return {'success': false,'msg':'Nombre de usuario previamente registrado'};
        }

        if(!validateSigns.test(name)){
            return {'success': false,'msg':'El nombre de usuario no debe contener caracteres especiales'}
        }
        
        if(!validateMayusculas.test(name)){
            return {'success':false, 'msg': 'El nombre de usuario debe contener al menos una mayuscula'}
        }

        if(!validateNumbers.test(name)){
            return {'success':false,'msg': 'El nombre de usuario debe contener al menos un numero'}
        }

        if (name.length < 8 || name.length > 20) {
            return {'success':false, 'msg': 'El nombre de usuario debe contener un minimo de 8 caracteres y un maximo de 20'}
        }
        
        return {'success': true, 'msg': ''};
    },
    'validatePassword': (pass) => {
        const validateSigns = /[!@#$%^&*(),.?":{}|<>]/;
        const validateMayusculas = /[A-Z]/;

        if (/\s/.test(pass)) {
            return {'success':false, 'msg': 'La contraseña no debe contener espacios en blanco'}
        }

        if(!validateMayusculas.test(pass)){
            return {'success':false, 'msg': 'La contraseña debe contener al menos una mayuscula'}
        }

        if (pass.length < 8 ) {
            return {'success':false, 'msg': 'La contraseña de usuario debe ser al menos de 8 digitos'}
        }

        if(!validateSigns.test(pass)){
            return {'success': false,'msg':'La contraseña debe contener al menos uno de estos caracteres (@,#,$,!) etc.'}
        }

        return {'success': true, 'msg': ''};
    },
    'validateDNI': (dni) => {
        const validateNumbers = /^[0-9]+$/;
        const validatePetitedDigits = /(.)\1{3,}/
        
        if (dni.length < 10 ) {
            return {'success':false, 'msg': 'La identificacion debe ser de al menos 10 numeros'}
        }

        if(!validateNumbers.test(dni)){
            return {'success':false,'msg': 'La identificacion deben ser solo numeros'}
        }

        if(validatePetitedDigits.test(dni)){
            return {'success':false,'msg': 'La identificacion no debe contener mas de 3 digitos iguales consecutivos '}
        }

        return {'success': true, 'msg': ''};
    },
    'encrypUserPassword': async(password) => {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    },
    'comparePassword': async(password, recivePassword) => {
        return await bcrypt.compare(password, recivePassword)
    }
}