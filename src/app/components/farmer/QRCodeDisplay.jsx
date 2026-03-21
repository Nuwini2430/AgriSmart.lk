"use client";
import { useState } from "react";
import Button from "../common/Button";
import Card from "../common/Card";

export default function QRCodeDisplay({ registration, onDownload, onClose }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    setTimeout(() => {
      if (onDownload) {
        onDownload(registration);
      }
      setDownloading(false);
    }, 1000);
  };

  return (
    <Card className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">🌾</span>
        </div>
        <h3 className="text-xl font-bold text-secondary mb-1">
          Registration Confirmed!
        </h3>
        <p className="text-gray-500">
          Your QR code is ready for download
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border-2 border-gray-100 mb-6">
        <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="w-48 h-48 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
            <span className="text-white text-6xl">⬛</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-secondary mb-3">Registration Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Registration ID:</span>
            <span className="text-secondary font-medium">{registration.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Farmer Name:</span>
            <span className="text-secondary font-medium">{registration.farmerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">NIC:</span>
            <span className="text-secondary font-medium">{registration.nic}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Crop:</span>
            <span className="text-secondary font-medium">{registration.crop}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Acres:</span>
            <span className="text-secondary font-medium">{registration.acres}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span className="text-secondary font-medium">{registration.date}</span>
          </div>
        </div>
      </div>

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

      <p className="text-xs text-center text-gray-400 mt-4">
        Show this QR code when collecting your harvest or for verification
      </p>
    </Card>
  );
}