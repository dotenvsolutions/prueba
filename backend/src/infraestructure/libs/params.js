import dotenv from 'dotenv'
dotenv.config();

const params = {
    'port': process.env.SERVER_PORT,
    'jwt_secret': process.env.SECRECT
}

export default params