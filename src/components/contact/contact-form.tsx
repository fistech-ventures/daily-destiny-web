"use client";

import React, { useState } from "react";
import { submitContactForm } from "@/lib/api";

interface ContactFormProps {
  messages: {
    formTitle: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    purposeLabel: string;
    messageLabel: string;
    submitButton: string;
  };
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  purpose: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  purpose?: string;
  message?: string;
  general?: string;
}

export default function ContactForm({ messages }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    purpose: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (optional but if provided should be valid)
    if (formData.phoneNumber.trim() && !/^[\d\s\-\+\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Purpose validation
    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await submitContactForm({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        purpose: formData.purpose.trim(),
        message: formData.message.trim(),
      });

      setIsSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        purpose: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({
        general: "Failed to submit form. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 mb-2">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Thank You!
        </h3>
        <p className="text-green-700">
          Your message has been sent successfully. We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-lg md:text-xl lg:text-2xl mb-6">
        {messages.formTitle}
      </h3>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-base lg:text-lg font-medium mb-2">
            {messages.nameLabel} *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.fullName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-base lg:text-lg font-medium mb-2">
            {messages.emailLabel} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-base lg:text-lg font-medium mb-2">
            {messages.phoneLabel}
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.phoneNumber
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
        </div>

        <div>
          <label htmlFor="purpose" className="block text-base lg:text-lg font-medium mb-2">
            {messages.purposeLabel} *
          </label>
          <select
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white ${
              errors.purpose
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            disabled={isSubmitting}
          >
            <option value="">উদ্দেশ্য নির্বাচন করুন</option>
            <option value="complain">অভিযোগ</option>
            <option value="general">সাধারণ</option>
            <option value="appointment">অ্যাপয়েন্টমেন্ট</option>
            <option value="advertisement">বিজ্ঞাপন</option>
            <option value="news-publication">সংবাদ প্রকাশনা</option>
          </select>
          {errors.purpose && (
            <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-base lg:text-lg font-medium mb-2">
            {messages.messageLabel} *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
              errors.message
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : messages.submitButton}
        </button>
      </form>
    </div>
  );
}
