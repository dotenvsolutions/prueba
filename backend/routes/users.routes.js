import { Router } from "express";

import UserController from "../controllers/UserController";

const router = Router();

router.get('/',UserController.fetAll)
router.post('/create', UserController.store)
router.post('/update/:id', UserController.update)
router.post('/login', UserController.loginUser)


export default router 