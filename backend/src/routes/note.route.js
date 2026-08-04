import { createNote,getAllNotes } from "../controllers/note/note.controller.js";
import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router=Router();
router.route("/createNotes").post(verifyJwt,upload.single("pdf"),createNote);
router.route("/getAllNotes").get(verifyJwt,getAllNotes);
export default router;