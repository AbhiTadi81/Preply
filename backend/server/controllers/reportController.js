import { Report } from "../models/Report.js";
export const reportController = {
  async getTodayReport(req, res, next) {
    try {
      const report = await Report.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
      if (!report) return res.status(404).json({ message: "No interview report found" });
      return res.json(report);
    } catch (error) {
      return next(error);
    }
  },
  async getHistory(req, res, next) {
    try {
      const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });
      return res.json(reports);
    } catch (error) {
      return next(error);
    }
  }
};
