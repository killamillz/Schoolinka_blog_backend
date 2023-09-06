import { Router } from "express"
import { userLogin, userSignup, userVerify } from "../controllers/user";


const router = Router()

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/verify', userVerify);






export default router 
