"use client";
import { useEffect } from "react";

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md",
  showCloseButton = true 
}) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4"
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Content */}
        <div 
          className={`
            relative 
            ${sizes[size]} 
            w-full 
            bg-white 
            rounded-xl 
            shadow-modern-lg 
            transform 
            transition-all
            animate-slide-in
          `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-[#F1F5F9]">
              {title && (
                <h3 className="text-lg font-semibold text-[#1E293B]">
                  {title}
                </h3>
              )}
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-[#64748B] hover:text-[#1E293B] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Confirmation Modal
export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger"
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        {/* Icon */}
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
          ${variant === 'danger' ? 'bg-[#FEE2E2]' : 'bg-[#E8F5E9]'}`}>
          {variant === 'danger' ? (
            <svg className="w-8 h-8 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-[#00A86B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        <h4 className="text-lg font-semibold text-[#1E293B] mb-2">{title}</h4>
        <p className="text-[#64748B] mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[#F1F5F9] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors
              ${variant === 'danger' 
                ? 'bg-[#EF4444] hover:bg-[#DC2626]' 
                : 'bg-[#00A86B] hover:bg-[#00875A]'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}