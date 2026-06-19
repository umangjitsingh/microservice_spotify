import {} from 'express';
import axios from 'axios';
import multer from 'multer';
export const isAuth = async (req, res, next) => {
    try {
        const token = req?.cookies?.token || req.query.token;
        if (!token) {
            res.status(403).json({ error: "Please Login" });
            return;
        }
        const { data } = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/v1/me`, {
            headers: {
                token,
            }
        });
        req.user = data;
        next();
    }
    catch (e) {
        const error = e instanceof Error ? e.message : "Please Login";
        res.status(403).json({ error: error });
        console.log(e);
    }
};
const storage = multer.memoryStorage();
const uploadFile = multer({ storage: storage }).single('file');
export default uploadFile;
//# sourceMappingURL=middleware.js.map