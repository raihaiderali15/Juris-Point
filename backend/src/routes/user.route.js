import { Router } from "express";
import { registerUser,loginUser,logoutUser ,forgotPassword ,resetPassword,refreshAccessToken ,getUserProfile ,updateUserProfile,changePassword ,getAllUsers,changeUserRole ,verifyEmail,verifyEmailToken} from "../controllers/user/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout",verifyJwt, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token",refreshAccessToken);
router.get("/profile", verifyJwt, getUserProfile);
router.put("/update-profile", verifyJwt, updateUserProfile);
router.put("/change-password", verifyJwt, changePassword);
router.get("/users", verifyJwt, getAllUsers);
router.put("/users/:userId/role", verifyJwt, changeUserRole);
router.post("/verify-email",verifyJwt, verifyEmail);
router.post("/verify-email-token/:token ", verifyEmailToken);
export default router;