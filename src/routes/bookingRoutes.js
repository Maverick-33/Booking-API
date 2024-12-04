import express from "express";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getAllBookings);
router.get("/:id", authenticateToken, getBookingById);
router.post("/", authenticateToken, createBooking);
router.put("/:id", authenticateToken, updateBooking);
router.delete("/:id", authenticateToken, deleteBooking);

export default router;
