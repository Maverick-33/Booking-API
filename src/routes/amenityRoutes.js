import express from "express";
import {
  getAllAmenities,
  getAmenityById,
  createAmenity,
  updateAmenity,
  deleteAmenity,
} from "../controllers/amenityController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getAllAmenities);
router.get("/:id", authenticateToken, getAmenityById);
router.post("/", authenticateToken, createAmenity);
router.put("/:id", authenticateToken, updateAmenity);
router.delete("/:id", authenticateToken, deleteAmenity);

export default router;
