// routes/googleAuth.js

import express from "express";
import { googleRegister, googleLogin } from "../controllers/googleAuthController.js";

const router = express.Router();

router.post("/register", googleRegister);
router.post("/login", googleLogin);

export default router;
