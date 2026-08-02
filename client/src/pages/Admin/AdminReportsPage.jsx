import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Clock, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch reports on load
  const fetchReports = async () => {
    try {
      setLoading(true);
      // Hits GET /api/reports via Axios baseURL configuration
      const response = await api.get("/reports");

      // Extract array from backend JSON: { success: true, count: X, data: [...] }
      setReports(response.data?.data || []);
    } catch (error) {
      console.error("Fetch reports error:", error.response || error);
      toast.error(
        error.response?.data?.message || "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle status update (Resolve / Reject)
  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      setUpdatingId(reportId);
      // Hits PATCH /api/reports/:id
      const { data } = await api.patch(`/reports/${reportId}`, {
        status: newStatus,
      });

      toast.success(data?.message || "Status updated successfully");

      // Update local state UI
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          User Reports & Issues
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review and resolve issues reported by guests regarding their stays.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center gap-3 py-16 justify-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-600 font-medium">Loading reports...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">
            No Reports Found
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            There are currently no reported issues from users.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Hotel</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => (
                  <tr
                    key={report._id}
                    className="hover:bg-slate-50/50 transition"
                  >
                    {/* User */}
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {report.user?.name || "Guest"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {report.user?.email || "No email"}
                        </p>
                      </div>
                    </td>

                    {/* Hotel */}
                    <td className="p-4 text-slate-700 font-medium">
                      {report.hotel?.name || "N/A"}
                    </td>

                    {/* Reason */}
                    <td className="p-4 text-slate-800 font-semibold">
                      {report.reason}
                    </td>

                    {/* Description */}
                    <td className="p-4 text-slate-500 max-w-xs truncate">
                      {report.description}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                          report.status === "resolved"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : report.status === "rejected"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {report.status === "resolved" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : report.status === "rejected" ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {report.status || "Pending"}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {report.status !== "resolved" && (
                          <button
                            disabled={updatingId === report._id}
                            onClick={() =>
                              handleStatusUpdate(report._id, "resolved")
                            }
                            className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                          >
                            Resolve
                          </button>
                        )}
                        {report.status !== "rejected" && (
                          <button
                            disabled={updatingId === report._id}
                            onClick={() =>
                              handleStatusUpdate(report._id, "rejected")
                            }
                            className="px-3 py-1 text-xs font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 transition disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;