import { Router } from "express";

import UserService from "../../application/user/UserService";

const router = Router();
const uService = new UserService()

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

router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    try {
        const deleteUser = await uService.deteleUser(id)
        
        if(!deleteUser.success){
            return res.status(401).json(deleteUser)
        }
        res.json(deleteUser)
    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, error: error.message });
    }
    
})


export default router 