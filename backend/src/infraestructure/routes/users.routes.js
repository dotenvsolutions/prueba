import { Router } from "express";

import UserService from "../../application/user/UserService";

const router = Router();
const uService = new UserService()

router.get('/', async (req, res) => {
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

router.post('/create', async (req, res) => {
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

router.put('/updateUser/:id', async (req, res) => {
    const id = req.params.id
    const {username,password,rol} = req.body
    try {
        const user = await uService.updateUser(id,username,password, rol)
        
        if(!user.success){
            return res.status(401).json(user)
        }
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, error: error.message });
    }
    
})

router.delete('/delete/:id', async (req, res) => {
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


export default router 