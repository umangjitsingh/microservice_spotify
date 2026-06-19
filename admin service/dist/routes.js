import express from "express";
import { addAlbum } from "./controller.js";
import uploadFile, { isAuth } from "./middleware.js";
const router = express.Router();
// router.post("/test", (req, res) => {
//   res.send("Album added");
// });
router.post("/addAlbum", isAuth, uploadFile, addAlbum);
export default router;
//# sourceMappingURL=routes.js.map