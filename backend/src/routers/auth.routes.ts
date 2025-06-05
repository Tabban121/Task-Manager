import { Router } from 'express';
import { signup } from '../controllers/AuthController';
import { login } from '../controllers/AuthController';
import { logout } from '../controllers/AuthController';
const router = Router();


router.post('/signup', signup);
router.post('/login' , login)
router.post("/logout", logout)

export default router;
