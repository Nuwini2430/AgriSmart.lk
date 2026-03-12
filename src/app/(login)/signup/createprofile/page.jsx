// src/components/CreateProfile.jsx
import React, { useState } from 'react';
import styles from "./createprofile.module.css"; // Import CSS as Module

const CreateProfile = () => {
  // useState hook to handle form data
  const [formData, setFormData] = useState({
    fullName: '',
    nic: '',
    gender: '',
    address: '',
    profilePicture: null, // Store the file object
  });

  // Store preview URL for the image
  const [previewUrl, setPreviewUrl] = useState(null);

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle profile picture upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePicture: file,
      });

      // Create a preview of the image using FileReader
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload

    // TODO: Make an API call to send data to the backend
    // For now, log data to console and show alert
    console.log('Profile Data:', formData);
    
    // Log file name separately if exists
    if (formData.profilePicture) {
        console.log('Uploaded File Name:', formData.profilePicture.name);
    }

    alert('Profile Created Successfully! (Check console for data)');
    
    // (Optional) Reset form or navigate to another page
  };

  return (
    // Use styles object for className (CSS Module)
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <h2 className={styles.title}>Create Your Profile</h2>
        <p className={styles.subtitle}>Fill in your details to get started.</p>

        <form onSubmit={handleSubmit}>

          {/* Full Name Field */}
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name <span className={styles.required}>*</span></label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g., K. M. Perera"
              required
            />
          </div>

          {/* NIC Field */}
          <div className={styles.formGroup}>
            <label htmlFor="nic">NIC <span className={styles.required}>*</span></label>
            <input
              type="text"
              id="nic"
              name="nic"
              value={formData.nic}
              onChange={handleInputChange}
              placeholder="e.g., 123456789V / 199812345678"
              required
            />
          </div>

          {/* Gender Field (Radio Buttons) */}
          <div className={styles.formGroup}>
            <label>Gender <span className={styles.required}>*</span></label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleInputChange}
                  required
                />
                Male
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleInputChange}
                  required
                />
                Female
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={formData.gender === 'Other'}
                  onChange={handleInputChange}
                  required
                />
                Other
              </label>
            </div>
          </div>

          {/* Address Field (Textarea) */}
          <div className={styles.formGroup}>
            <label htmlFor="address">Address <span className={styles.required}>*</span></label>
            <textarea
              id="address"
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="e.g., No. 50, Galle Road, Colombo 03"
              required
            ></textarea>
          </div>

          {/* Profile Picture Field */}
          <div className={styles.formGroup}>
            <label htmlFor="profilePicture">Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*" // Only allow image files
              onChange={handleFileChange}
            />
            {/* Image Preview */}
            {previewUrl && (
              <div className={styles.imagePreview}>
                <img src={previewUrl} alt="Profile Preview" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.submitBtn}>
            Create Profile
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateProfile;