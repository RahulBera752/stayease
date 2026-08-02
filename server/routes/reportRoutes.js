import express from "express";
import {
  createReport,
  getAllReports,
  updateReportStatus,
} from "../controllers/reportController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createReport)
  .get(protect, admin, getAllReports);

router.patch("/:id", protect, admin, updateReportStatus);

export default router;