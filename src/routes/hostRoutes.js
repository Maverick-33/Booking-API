import express from "express";
import {
  getAllHosts,
  getHostById,
  createHost,
  updateHost,
  deleteHost,
} from "../controllers/hostController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getAllHosts);
router.get("/:id", authenticateToken, getHostById);
router.post("/", authenticateToken, createHost);
router.put("/:id", authenticateToken, updateHost);
router.delete("/:id", authenticateToken, deleteHost);

export default router;
