import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Camera,
  MapPin,
  Calendar,
  Save,
  Edit3,
  Heart,
  Key,
  Compass,
  AlertCircle,
  Check,
  Building,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const DEFAULT_PROFILE = {
  name: "Rahul Sharma",
  email: "rahul@example.com",
  phone: "+91 98765 43210",
  role: "Customer",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
  address: "MG Road, Indiranagar, Bengaluru, KA 560038",
  dob: "1998-05-14",
  gender: "Male",
  roomPreference: "King Suite",
  dietaryPreference: "Vegetarian",
  cityPreference: "Mumbai",
  emergencyName: "Priya Sharma",
  emergencyPhone: "+91 98765 00000",
};

const UserProfilePage = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  // 🔄 Load saved data from localStorage or fallback to context/defaults
  const [formData, setFormData] = useState(() => {
    const savedProfile = localStorage.getItem("stayease_user_profile");
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (err) {
        console.error("Error reading saved profile", err);
      }
    }

    return {
      name: user?.name || DEFAULT_PROFILE.name,
      email: user?.email || DEFAULT_PROFILE.email,
      phone: user?.phone || DEFAULT_PROFILE.phone,
      role: user?.role || DEFAULT_PROFILE.role,
      avatar: user?.avatar?.url || user?.avatar || DEFAULT_PROFILE.avatar,
      address: user?.address || DEFAULT_PROFILE.address,
      dob: user?.dob || DEFAULT_PROFILE.dob,
      gender: user?.gender || DEFAULT_PROFILE.gender,
      roomPreference: DEFAULT_PROFILE.roomPreference,
      dietaryPreference: DEFAULT_PROFILE.dietaryPreference,
      cityPreference: DEFAULT_PROFILE.cityPreference,
      emergencyName: DEFAULT_PROFILE.emergencyName,
      emergencyPhone: DEFAULT_PROFILE.emergencyPhone,
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [avatarPreview, setAvatarPreview] = useState(formData.avatar);
  const [uploading, setUploading] = useState(false);

  // Sync avatar preview if formData avatar changes
  useEffect(() => {
    setAvatarPreview(formData.avatar);
  }, [formData.avatar]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 💾 Persist changes function
  const saveToLocalStorageAndContext = (updatedData) => {
    // 1. Save full profile to local storage (Persists across page refresh)
    localStorage.setItem("stayease_user_profile", JSON.stringify(updatedData));

    // 2. Update Auth user object in localStorage & React Context
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUserObj = {
      ...existingUser,
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.phone,
      avatar: updatedData.avatar,
      role: updatedData.role,
    };

    localStorage.setItem("user", JSON.stringify(updatedUserObj));

    if (setUser) {
      setUser(updatedUserObj);
    }
  };

  // 📷 Handle Avatar Photo Upload
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result;
        setAvatarPreview(newAvatar);
        
        const updated = { ...formData, avatar: newAvatar };
        setFormData(updated);
        saveToLocalStorageAndContext(updated);

        setUploading(false);
        toast.success("Profile photo updated & saved!");
      };
      reader.readAsDataURL(file);
    }
  };

  // 💾 Save Profile Form
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    
    saveToLocalStorageAndContext(formData);
    toast.success("Profile details saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 🚀 Top Header Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-500 p-8 shadow-2xl"
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Avatar with Camera Icon Overlay */}
            <div className="relative group">
              <img
                src={avatarPreview}
                alt={formData.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-xl transition-transform duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={handlePhotoClick}
                disabled={uploading}
                title="Change Avatar Photo"
                className="absolute bottom-0 right-0 p-2.5 rounded-full bg-slate-900/90 text-white hover:bg-primary transition-all shadow-lg border border-white/20 cursor-pointer"
              >
                <Camera size={18} />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Profile Brief Info */}
            <div className="text-center md:text-left space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {formData.name}
                </h1>
                <Sparkles className="text-amber-300 fill-amber-300" size={20} />
              </div>
              <p className="text-white/80 font-medium text-sm">
                {formData.email}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md uppercase tracking-wider">
                  <Shield size={12} /> {formData.role} ACCOUNT
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 backdrop-blur-md">
                  <Check size={12} /> Verified Member
                </span>
              </div>
            </div>

            {/* Edit / Save Action Button */}
            <div className="md:ml-auto flex items-center gap-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-md transition-all border border-white/20 shadow-lg cursor-pointer"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-all shadow-lg cursor-pointer"
                >
                  <Save size={16} /> Save Changes
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* 📌 Tab Navigation Options */}
        <div className="flex border-b border-slate-800 gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab("personal")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "personal"
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <User size={18} /> Personal Details
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "preferences"
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass size={18} /> Travel Preferences
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "security"
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Key size={18} /> Security & Emergency
          </button>
        </div>

        {/* 📑 Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* TAB 1: Personal Details */}
          {activeTab === "personal" && (
            <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <User className="text-indigo-400" size={20} /> Personal Information
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 text-slate-500" size={18} />
                    <input
                      type="text"
                      name="name"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-75 disabled:bg-slate-900/40"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 text-slate-500" size={18} />
                    <input
                      type="email"
                      name="email"
                      disabled
                      value={formData.email}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-slate-400 text-sm focus:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 text-slate-500" size={18} />
                    <input
                      type="text"
                      name="phone"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-75 disabled:bg-slate-900/40"
                    />
                  </div>
                </div>

                {/* Account Type */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Account Type
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3.5 top-3 text-slate-500" size={18} />
                    <input
                      type="text"
                      disabled
                      value={formData.role}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-slate-400 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 text-slate-500" size={18} />
                    <input
                      type="date"
                      name="dob"
                      disabled={!isEditing}
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-75 disabled:bg-slate-900/40"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Gender
                  </label>
                  <select
                    name="gender"
                    disabled={!isEditing}
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-75 disabled:bg-slate-900/40"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Residential Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Residential Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 text-slate-500" size={18} />
                    <input
                      type="text"
                      name="address"
                      disabled={!isEditing}
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-75 disabled:bg-slate-900/40"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Travel Preferences */}
          {activeTab === "preferences" && (
            <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <Compass className="text-indigo-400" size={20} /> Stay Preferences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Preferred Room Type
                  </label>
                  <select
                    name="roomPreference"
                    disabled={!isEditing}
                    value={formData.roomPreference}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-75"
                  >
                    <option value="Deluxe Room">Deluxe Room</option>
                    <option value="King Suite">King Suite</option>
                    <option value="Executive Penthouse">Executive Penthouse</option>
                    <option value="Ocean View Villa">Ocean View Villa</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Dietary Preferences
                  </label>
                  <select
                    name="dietaryPreference"
                    disabled={!isEditing}
                    value={formData.dietaryPreference}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-75"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Jain Food">Jain Food</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Favorite Travel Destination / City
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3 text-slate-500" size={18} />
                    <input
                      type="text"
                      name="cityPreference"
                      disabled={!isEditing}
                      value={formData.cityPreference}
                      onChange={handleChange}
                      placeholder="e.g. Goa, Mumbai, Jaipur"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-75"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Security & Emergency Contacts */}
          {activeTab === "security" && (
            <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <AlertCircle className="text-indigo-400" size={20} /> Emergency Contact
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    name="emergencyName"
                    disabled={!isEditing}
                    value={formData.emergencyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-75"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Emergency Phone
                  </label>
                  <input
                    type="text"
                    name="emergencyPhone"
                    disabled={!isEditing}
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-75"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Key className="text-amber-400" size={18} /> Password & Account Security
                </h3>
                <button
                  type="button"
                  onClick={() => toast.success("Password reset link sent to your registered email!")}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl text-sm font-medium transition-colors border border-slate-700 cursor-pointer"
                >
                  Send Password Reset Email
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfilePage;