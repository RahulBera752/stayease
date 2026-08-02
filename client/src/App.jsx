import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";

// Layout Components
import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import OwnerLayout from "./layouts/OwnerLayout.jsx";

// Route Guard
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// Public Pages
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import VerifyOtpPage from "./pages/VerifyOtpPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import HotelDetailsPage from "./pages/HotelDetailsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Protected User Pages
import BookingPage from "./pages/BookingPage.jsx";
import MyBookingsPage from "./pages/MyBookingsPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";

// Dedicated Owner Pages
import OwnerHotelsPage from "./pages/owner/OwnerHotelsPage.jsx";
import OwnerAddHotelPage from "./pages/owner/OwnerAddHotelPage.jsx";
import OwnerEditHotelPage from "./pages/owner/OwnerEditHotelPage.jsx";
import OwnerBookingsPage from "./pages/owner/OwnerBookingsPage.jsx";

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import HotelsPage from "./pages/admin/HotelsPage.jsx";
import AddHotelPage from "./pages/admin/AddHotelPage.jsx";
import EditHotelPage from "./pages/admin/EditHotelPage.jsx";
import BookingsPage from "./pages/admin/BookingsPage.jsx";
import UsersPage from "./pages/admin/UsersPage.jsx";
import ReviewsPage from "./pages/admin/ReviewsPage.jsx";
import CouponsPage from "./pages/admin/CouponsPage.jsx";
import AdminReportsPage from "./pages/admin/AdminReportsPage.jsx";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage.jsx";

function App() {
  return (
    <Routes>
      {/* ================= MAIN LAYOUT ROUTES ================= */}
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/hotels/:slug" element={<HotelDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Protected Customer/User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/dashboard/profile" element={<UserProfilePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/dashboard/wishlist" element={<WishlistPage />} />
        </Route>

        {/* Access Denied Fallback Page */}
        <Route
          path="/unauthorized"
          element={
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
              <h1 className="text-4xl font-bold text-rose-600 mb-2">
                403 - Access Denied
              </h1>
              <p className="text-gray-600 max-w-md mb-6">
                Your account does not have owner permissions to view or manage
                hotel listings.
              </p>
              <Link
                to="/"
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
              >
                Back to Home
              </Link>
            </div>
          }
        />
      </Route>

      {/* ================= HOTEL OWNER PANEL ROUTES ================= */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute
            allowedRoles={[
              "owner",
              "hotelowner",
              "hotel_owner",
              "hotelOwner",
              "vendor",
              "admin",
            ]}
          >
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/owner/hotels" replace />} />
        <Route path="hotels" element={<OwnerHotelsPage />} />
        <Route path="hotels/add" element={<OwnerAddHotelPage />} />
        <Route path="hotels/edit/:id" element={<OwnerEditHotelPage />} />
        <Route path="bookings" element={<OwnerBookingsPage />} />
      </Route>

      {/* ================= ADMIN PANEL ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="hotels" element={<HotelsPage />} />
        <Route path="hotels/add" element={<AddHotelPage />} />
        <Route path="hotels/edit/:id" element={<EditHotelPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* ================= 404 CATCH-ALL ROUTE ================= */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;