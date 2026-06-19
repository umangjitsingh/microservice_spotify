import {type Request, type Response, type NextFunction} from 'express';
import axios from 'axios';
import multer from 'multer';

interface IUser {
    _id:string;
    name: string;
    email: string;
    password: string;
    role?: string;
    playlist?: string[]
}

declare global {
    namespace Express {
        interface Request {
            user?: IUser | null;
        }
    }
}

export const isAuth=async(req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        const token = req?.cookies?.token || req.query.token;
        if(!token){
            res.status(403).json({error:"Please Login"});
            return;
        }

        const {data} = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/me`,{
            headers:{
                token,
            }
        });
        req.user=data;
        next();

    } catch (e:unknown) {
        const error= e instanceof Error ? e.message : "Please Login"
        res.status(403).json({error:error});
        console.log(e);
    }
}

const storage=multer.memoryStorage();
const uploadFile=multer({storage:storage}).single('file');

export default uploadFile;