import React, { useState } from "react";
import {
  Building2,
  Percent,
  Bell,
  ShieldCheck,
  CreditCard,
  Save,
  Globe,
  Mail,
  Phone,
  DollarSign,
  Lock,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  // Form States
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "StayEase",
    supportEmail: "support@stayease.com",
    supportPhone: "+91 98765 43210",
    currency: "INR",
    timezone: "Asia/Kolkata",
  });

  const [bookingSettings, setBookingSettings] = useState({
    commissionRate: 12, // Platform fee percentage
    taxRate: 18, // GST/Tax rate percentage
    cancellationWindowHours: 24,
    autoApproveBookings: true,
    enableCoupons: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewBooking: true,
    emailOnCancellation: true,
    emailOnNewReport: true,
    dailySummaryReport: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call to save platform settings
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings updated successfully!");
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Platform Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage system configurations, commission rates, and notification rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs (Sidebar) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 h-fit shadow-sm space-y-1">
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition ${
              activeTab === "general"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Building2 className="w-4 h-4" /> General Platform
          </button>

          <button
            onClick={() => setActiveTab("booking")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition ${
              activeTab === "booking"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Percent className="w-4 h-4" /> Booking & Taxes
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition ${
              activeTab === "notifications"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition ${
              activeTab === "security"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Security & Admin
          </button>
        </div>

        {/* Form Container */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. GENERAL SETTINGS TAB */}
            {activeTab === "general" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-800 border-b pb-3">
                  General Configurations
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Platform Name
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={generalSettings.platformName}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            platformName: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Primary Currency
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={generalSettings.currency}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            currency: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Support Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={generalSettings.supportEmail}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            supportEmail: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Support Hotline
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={generalSettings.supportPhone}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            supportPhone: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BOOKING & TAXES TAB */}
            {activeTab === "booking" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-800 border-b pb-3">
                  Rates & Booking Rules
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Platform Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      value={bookingSettings.commissionRate}
                      onChange={(e) =>
                        setBookingSettings({
                          ...bookingSettings,
                          commissionRate: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="text-xs text-slate-400 mt-1 block">
                      Fee collected per guest booking.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Standard GST / Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={bookingSettings.taxRate}
                      onChange={(e) =>
                        setBookingSettings({
                          ...bookingSettings,
                          taxRate: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        Auto-Approve Guest Bookings
                      </p>
                      <p className="text-xs text-slate-500">
                        Automatically confirm bookings upon payment completion.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={bookingSettings.autoApproveBookings}
                      onChange={(e) =>
                        setBookingSettings({
                          ...bookingSettings,
                          autoApproveBookings: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 accent-indigo-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        Enable Promotional Coupons
                      </p>
                      <p className="text-xs text-slate-500">
                        Allow users to apply discount codes at checkout.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={bookingSettings.enableCoupons}
                      onChange={(e) =>
                        setBookingSettings({
                          ...bookingSettings,
                          enableCoupons: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 accent-indigo-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-800 border-b pb-3">
                  Admin Alert Rules
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        New Booking Email Alerts
                      </p>
                      <p className="text-xs text-slate-500">
                        Receive instant notifications when a room is reserved.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailOnNewBooking}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailOnNewBooking: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-indigo-600 rounded accent-indigo-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        User Issues & Reports
                      </p>
                      <p className="text-xs text-slate-500">
                        Get alerted immediately when a user reports a problem.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailOnNewReport}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailOnNewReport: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-indigo-600 rounded accent-indigo-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. SECURITY & ADMIN TAB */}
            {activeTab === "security" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-800 border-b pb-3">
                  Admin Security
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Update Admin Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving Changes..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;