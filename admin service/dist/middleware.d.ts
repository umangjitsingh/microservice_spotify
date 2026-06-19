import { type Request, type Response, type NextFunction } from 'express';
interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role?: string;
    playlist?: string[];
}
declare global {
    namespace Express {
        interface Request {
            user?: IUser | null;
        }
    }
}
export declare const isAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const uploadFile: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export default uploadFile;
//# sourceMappingURL=middleware.d.ts.map