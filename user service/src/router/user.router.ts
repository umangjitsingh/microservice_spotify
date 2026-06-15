import express from 'express';
import {getMe, loginUser, registerUser} from "../controller/user.controller.js";
import {AuthM} from "../AuthM.js";

const userRouter = express.Router();
    userRouter.post('/register', registerUser);
    userRouter.post('/login',loginUser);
    userRouter.get('/me',AuthM,getMe)


export default userRouter