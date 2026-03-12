"use client";
import { useState } from "react";
import Button from "../common/Button";
import Card from "../common/Card";

export default function QRCodeDisplay({ registration, onDownload, onClose }) {
  const [downloading, setDownloading] = useState(false);

  // Mock QR code URL - In real app, this would come from backend
  const qrCodeUrl = registration.qrCodeUrl || "/images/mock-qr.png";

  const handleDownload = async () => {
    setDownloading(true);
    
    // Simulate download
    setTimeout(() => {
      if (onDownload) {
        onDownload(registration);
      }
      setDownloading(false);
    }, 1000);
  };

  return (
    <Card className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#00A86B] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">🌾</span>
        </div>
        <h3 className="text-xl font-bold text-[#1E293B] mb-1">
          Registration Confirmed!
        </h3>
        <p className="text-[#64748B]">
          Your QR code is ready for download
        </p>
      </div>

      {/* QR Code Image */}
      <div className="bg-white p-4 rounded-xl border-2 border-[#F1F5F9] mb-6">
        <div className="aspect-square bg-[#F8FAFC] rounded-lg flex items-center justify-center">
          {/* This would be actual QR code in real app */}
          <div className="w-48 h-48 bg-gradient-to-br from-[#00A86B] to-[#00875A] rounded-lg flex items-center justify-center">
            <span className="text-white text-6xl">⬛</span>
          </div>
        </div>
      </div>

      {/* Registration Details */}
      <div className="bg-[#F8FAFC] p-4 rounded-lg mb-6">
        <h4 className="font-medium text-[#1E293B] mb-3">Registration Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Registration ID:</span>
            <span className="text-[#1E293B] font-medium">{registration.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Farmer Name:</span>
            <span className="text-[#1E293B] font-medium">{registration.farmerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">NIC:</span>
            <span className="text-[#1E293B] font-medium">{registration.nic}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Crop:</span>
            <span className="text-[#1E293B] font-medium">{registration.crop}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Acres:</span>
            <span className="text-[#1E293B] font-medium">{registration.acres}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Date:</span>
            <span className="text-[#1E293B] font-medium">{registration.date}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1"
        >
          {downloading ? "Downloading..." : "Download QR Code"}
        </Button>
        
        <Button
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          Close
        </Button>
      </div>

      {/* Note */}
      <p className="text-xs text-center text-[#64748B] mt-4">
        Show this QR code when collecting your harvest or for verification
      </p>
    </Card>
  );
}