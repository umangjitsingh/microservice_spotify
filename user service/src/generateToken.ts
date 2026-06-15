import 'dotenv/config';
import jwt from 'jsonwebtoken';
import type {IUser} from './models/user.model.js';


const generateToken = (user:IUser):string => {
    return jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {expiresIn: '7d'});
};
export default generateToken;