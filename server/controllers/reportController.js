import  Report  from "../models/reportModel.js";

/**
 * @desc    Create a new report (User after trip completion)
 * @route   POST /api/reports
 * @access  Private
 */
export const createReport = async (req, res, next) => {
  try {
    const { hotelId, bookingId, reason, description } = req.body;

    if (!hotelId || !bookingId || !reason || !description) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const report = await Report.create({
      user: req.user._id,
      hotel: hotelId,
      booking: bookingId,
      reason,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reports (Admin)
 * @route   GET /api/reports
 * @access  Private/Admin
 */
export const getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find({})
      .populate({ path: "user", select: "name email", strictPopulate: false })
      .populate({ path: "hotel", select: "name location", strictPopulate: false })
      .populate({ path: "booking", select: "checkIn checkOut", strictPopulate: false })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Error in getAllReports controller:", error);
    next(error);
  }
};

/**
 * @desc    Update report status & action (Admin)
 * @route   PATCH /api/reports/:id
 * @access  Private/Admin
 */
export const updateReportStatus = async (req, res, next) => {
  try {
    const { status, adminAction } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) {
      res.status(404);
      throw new Error("Report not found");
    }

    if (status) report.status = status;
    if (adminAction !== undefined) report.adminAction = adminAction;

    await report.save();

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};