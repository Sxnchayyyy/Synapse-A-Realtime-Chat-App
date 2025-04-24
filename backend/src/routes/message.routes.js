import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, (req, res, next) => {
    if (!req.params.id) return res.status(400).json({ error: "Missing ID" });
    next();
  }, sendMessage);
  

export default router;