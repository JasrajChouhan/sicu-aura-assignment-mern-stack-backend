import express from 'express'
import { signup , signin, logout, getuser } from '../controllers/user.controller.js';
import {multerUpload} from '../middlewares/mullter.middlware.js'
import isAuthorized from '../middlewares/auth.middleware.js'



const router = express.Router();

router.post('/signup', multerUpload.single('registrationCertificate'), signup);
router.post('/signin', multerUpload.single('avatar'), signin);
router.get('/logout' , isAuthorized , logout);
router.get('/getuser' , isAuthorized , getuser);



export default router ;


