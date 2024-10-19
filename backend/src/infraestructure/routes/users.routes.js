import { Router } from "express";

import UserService from "../../application/user/UserService";
import {authJwt} from '../middlewares'
const router = Router();
const uService = new UserService()

router.get('/', [authJwt.verifyToken], async (req, res) => {
    try {
        const getAll = await uService.getAll()
        if(!getAll.success){
            return res.status(401).json(getAll)
        }
        res.status(200).json(getAll)
    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, error: error.message });
    }
})

router.post('/verifyToken', async(req, res) => {
    try {
        const verifyToken = await uService.fetchById(req.body.id)
        if(!verifyToken.success){
            return res.status(401).json(verifyToken)
        }
        res.status(200).json(verifyToken)
    } catch (error) {
        res.status(401).json({ success: false, error: error.message });
    }
})

router.post('/create', [authJwt.verifyToken], async (req, res) => {
    const {username,password, email,names,lastnames, dni, birthday, phone1,phone2,address} = req.body
    try {
        const newUser = await uService.createNewUser(username,password, email,names, lastnames,dni,birthday,phone1,phone2,address)
        
        if(!newUser.success){
            return res.status(401).json(newUser)
        }
        res.status(201).json(newUser)
    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, error: error.message });
    }
})

router.post('/login', async (req, res) => {
    const {username, password, email} = req.body
    try {
        const user = await uService.loginUser(username,password, email)
        
        if(!user.success){
            return res.status(401).json(user)
        }
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, error: error.message });
    }
    
})

router.put('/updateUser/:id', [authJwt.verifyToken], async (req, res) => {
    const id = req.params.id
    const {nombre,apellido,cedula,movil,fijo,direccion, rol} = req.body
    try {
        const user = await uService.updateUser(id,nombre,apellido,cedula,movil,fijo,direccion, rol)
        
        if(!user.success){
            return res.status(401).json(user)
        }
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, error: error.message });
    }
    
})

router.delete('/delete/:id', [authJwt.verifyToken], async (req, res) => {
    const id = req.params.id
    try {
        const deleteUser = await uService.deleteUser(id)
        
        if(!deleteUser.success){
            return res.status(401).json(deleteUser)
        }
        res.status(201).json(deleteUser)
    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, error: error.message });
    }
    
})

router.post('/logout', [authJwt.verifyToken], async (req, res) => {
    try {
        const {id,sessionId}= req.body
        const singLigout = await uService.logOut(id,sessionId)
        if(!singLigout.success){
            console.log(singLigout)
            return res.status(401).json(singLigout)
        }
        res.status(201).json(singLigout)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error.message });
    }
})


router.post('/generate', async (req, res) => {
    try {
        console.log(req.body)
        const users = await uService.generate(req.body)
        
        if(!users.success){
            return res.status(401).json(users)
        }
        res.json(users)
    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, error: error.message });
    }
    
})

export default router 