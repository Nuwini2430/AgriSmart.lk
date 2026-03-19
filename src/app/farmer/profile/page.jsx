"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function FarmerProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    district: "",
    nic: "",
    birthday: "",
    bio: ""
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Sri Lankan districts
  const districts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", 
    "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", 
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", 
    "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya", 
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/signin");
      return;
    }

    // Load user data from localStorage
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const userPhone = localStorage.getItem("userPhone") || "";

    setUser({
      name: userProfile.fullName || "John Doe",
      phone: userPhone,
      profilePic: userProfile.profilePic || null
    });

    setFormData({
      fullName: userProfile.fullName || "",
      phoneNumber: userPhone,
      email: userProfile.email || "john.doe@example.com",
      address: userProfile.address || "123 Main Street",
      district: userProfile.district || "Colombo",
      nic: userProfile.nicNumber || "821234567V",
      birthday: userProfile.birthday || "1982-05-15",
      bio: userProfile.bio || "Passionate farmer with 15 years of experience in sustainable farming."
    });

    if (userProfile.profilePic) {
      setPreviewUrl(userProfile.profilePic);
    }

    setLoading(false);
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file");
        return;
      }

      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSaving(true);

    // Mock save - Replace with API call
    setTimeout(() => {
      // Update localStorage
      const userProfile = {
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        district: formData.district,
        nicNumber: formData.nic,
        birthday: formData.birthday,
        bio: formData.bio,
        profilePic: previewUrl
      };

      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      localStorage.setItem("userPhone", formData.phoneNumber);

      setUser({
        name: formData.fullName,
        phone: formData.phoneNumber,
        profilePic: previewUrl
      });

      setIsEditing(false);
      setSaving(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-modern sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/farmer" className="flex items-center gap-2">
              <Image 
                src="/images/logo2.jpg" 
                alt="AgriSmart" 
                width={40} 
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-secondary">AgriSmart</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-modern overflow-hidden mb-6">
            {/* Cover Photo */}
            <div className="h-32 bg-gradient-to-r from-primary to-primary-dark"></div>
            
            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex justify-between items-start -mt-12">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full p-1">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">
                          {user?.name?.charAt(0) || "F"}
                        </span>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label
                      htmlFor="profile-pic"
                      className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer hover:bg-primary-dark"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                  )}
                  <input
                    type="file"
                    id="profile-pic"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Edit/Save Buttons */}
                <div className="mt-12">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* User Name */}
              <h1 className="text-2xl font-bold text-secondary mt-2">
                {formData.fullName || user?.name}
              </h1>
              <p className="text-gray-500">Member since {user?.memberSince || "2024"}</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-xl shadow-modern p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Personal Information</h2>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-secondary font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    isEditing ? 'border-gray-200' : 'bg-gray-50 border-gray-100'
                  }`}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-secondary font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    isEditing ? 'border-gray-200' : 'bg-gray-50 border-gray-100'
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-secondary font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    isEditing ? 'border-gray-200' : 'bg-gray-50 border-gray-100'
                  }`}
                />
              </div>

              {/* NIC */}
              <div>
                <label className="block text-secondary font-medium mb-2">
                  NIC Number
                </label>
                <input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    isEditing ? 'border-gray-200' : 'bg-gray-50 border-gray-100'
                  }`}
                />
              </div>

              {/* Birthday */}
              <div>
                <label className="block text-secondary font-medium mb-2">
                  Birthday
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    isEditing ? 'border-gray-200' : 'bg-gray-50 border-gray-100'
                  }`}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-secondary font-medium mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    isEditing ? 'border-gray-200' : 'bg-gray-50 border-gray-100'
                  }`}
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-secondary font-medium mb-2">
                  District
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    isEditing ? 'border-gray-200' : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-secondary font-medium mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    isEditing ? 'border-gray-200' : 'bg-gray-50 border-gray-100'
                  }`}
                  placeholder="Tell us about your farming experience..."
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}