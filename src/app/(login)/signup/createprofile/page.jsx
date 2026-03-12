"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function CreateProfile() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    birthday: "",
    nicNumber: "",
    address: "",
    district: "",
    gender: ""
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // NIC Validation (Sri Lanka)
  const validateNIC = (nic) => {
    const oldNIC = /^[0-9]{9}[vVxX]$/;
    const newNIC = /^[0-9]{12}$/;
    return oldNIC.test(nic) || newNIC.test(nic);
  };

  // Calculate age from birthday
  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({...errors, profilePic: "Image size should be less than 2MB"});
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors({...errors, profilePic: "Please upload an image file"});
        return;
      }

      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors({...errors, profilePic: null});
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (formData.fullName.length < 3) {
        newErrors.fullName = "Name must be at least 3 characters";
      }

      if (!formData.birthday) {
        newErrors.birthday = "Birthday is required";
      } else {
        const age = calculateAge(formData.birthday);
        if (age < 18) {
          newErrors.birthday = "You must be at least 18 years old";
        } else if (age > 100) {
          newErrors.birthday = "Please enter a valid birthday";
        }
      }

      if (!formData.gender) {
        newErrors.gender = "Please select your gender";
      }
    }

    if (step === 2) {
      if (!formData.nicNumber.trim()) {
        newErrors.nicNumber = "NIC number is required";
      } else if (!validateNIC(formData.nicNumber)) {
        newErrors.nicNumber = "Please enter a valid NIC number (e.g., 821234567V or 200012345678)";
      }
    }

    if (step === 3) {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      }
      if (!formData.district) {
        newErrors.district = "Please select your district";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }

    setLoading(true);

    // Mock profile creation - Replace with actual API call
    setTimeout(() => {
      // Save profile data to localStorage (temporary)
      const profileData = {
        ...formData,
        profilePic: previewUrl
      };
      localStorage.setItem("userProfile", JSON.stringify(profileData));
      localStorage.setItem("profileCompleted", "true");
      
      // Redirect to farmer dashboard
      router.push("/farmer");
      setLoading(false);
    }, 1500);
  };

  // Sri Lankan districts
  const districts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", 
    "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", 
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", 
    "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya", 
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex justify-center mb-4">
              <Image 
                src="/images/logo2.jpg" 
                alt="AgriSmart Logo" 
                width={60} 
                height={60}
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-secondary">Complete Your Profile</h1>
          <p className="text-gray-500 mt-1">Tell us more about yourself</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {["Personal Info", "NIC Details", "Address", "Photo"].map((label, i) => (
              <span
                key={i}
                className={`text-xs md:text-sm ${
                  step > i + 1 ? "text-primary font-medium" : step === i + 1 ? "text-primary font-bold" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-modern-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary mb-4">Personal Information</h2>
                
                {/* Full Name */}
                <div>
                  <label className="block text-secondary font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className={`w-full px-4 py-3 border ${
                      errors.fullName ? 'border-red-500' : 'border-gray-200'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Birthday */}
                <div>
                  <label className="block text-secondary font-medium mb-2">
                    Birthday <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                    className={`w-full px-4 py-3 border ${
                      errors.birthday ? 'border-red-500' : 'border-gray-200'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                  />
                  {errors.birthday && (
                    <p className="text-xs text-red-500 mt-1">{errors.birthday}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-secondary font-medium mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {["Male", "Female", "Other"].map((gender) => (
                      <label key={gender} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="text-gray-700">{gender}</span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: NIC Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary mb-4">NIC Details</h2>
                
                {/* NIC Number */}
                <div>
                  <label className="block text-secondary font-medium mb-2">
                    NIC Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 821234567V or 200012345678"
                    value={formData.nicNumber}
                    onChange={(e) => setFormData({...formData, nicNumber: e.target.value})}
                    className={`w-full px-4 py-3 border ${
                      errors.nicNumber ? 'border-red-500' : 'border-gray-200'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                  />
                  {errors.nicNumber && (
                    <p className="text-xs text-red-500 mt-1">{errors.nicNumber}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Old format: 9 digits + V (e.g., 821234567V)<br />
                    New format: 12 digits (e.g., 200012345678)
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Address */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary mb-4">Address Details</h2>
                
                {/* Address */}
                <div>
                  <label className="block text-secondary font-medium mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows="3"
                    className={`w-full px-4 py-3 border ${
                      errors.address ? 'border-red-500' : 'border-gray-200'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="block text-secondary font-medium mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    className={`w-full px-4 py-3 border ${
                      errors.district ? 'border-red-500' : 'border-gray-200'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                  >
                    <option value="">Select your district</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-xs text-red-500 mt-1">{errors.district}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Profile Picture */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary mb-4">Profile Picture</h2>
                
                <div className="flex flex-col items-center">
                  {/* Image Preview */}
                  <div className="mb-4">
                    {previewUrl ? (
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200">
                        <span className="text-4xl text-gray-400">👤</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="profile-pic"
                    />
                    <label
                      htmlFor="profile-pic"
                      className="inline-block px-6 py-2 bg-gray-100 text-secondary rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Choose Photo
                    </label>
                    <p className="text-xs text-gray-400 mt-2">
                      Max file size: 2MB. Supported: JPG, PNG
                    </p>
                    {errors.profilePic && (
                      <p className="text-xs text-red-500 mt-1">{errors.profilePic}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 border border-gray-300 text-secondary rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="ml-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-modern disabled:opacity-50"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-modern disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </span>
                  ) : "Complete Profile"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}