import React, { useState } from 'react';
import { Clapperboard, AlertCircle, ArrowLeft } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';
import WhatsAppSection from '../components/WhatsAppSection';
import ReviewModal from '../components/ReviewModal';
import SuccessCard from '../components/SuccessCard';
import WhyJoinSection from '../components/WhyJoinSection';

export default function Register({ onNavigateHome }) {
  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    department: '',
    section: '',
    phone: '',
    email: ''
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Submission / Flow state
  const [showReview, setShowReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Handle standard text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear inline error on edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setSubmissionError('');
  };

  // Validate all participant fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!formData.registerNumber.trim()) {
      newErrors.registerNumber = 'Please enter your register number.';
    }

    if (!formData.department) {
      newErrors.department = 'Please select your department.';
    }

    if (!formData.section) {
      newErrors.section = 'Please select your section.';
    }

    // 10-digit Indian mobile validation
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Trigger review modal
  const handleOpenReview = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowReview(true);
    }
  };

  // Submit registration to API
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const resJson = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          // Duplicate registration
          setSubmissionError('This register number is already registered for Frame Fest ’26.');
          setShowReview(false);
          return;
        }
        throw new Error(resJson.message || 'Registration failed. Try again after checking entered information.');
      }

      // Success
      setShowReview(false);
      setSuccessData(resJson.data);
    } catch (err) {
      console.error('Registration submission error:', err);
      setSubmissionError(err.message || 'REGISTRATION FAILED. Try again after checking the entered information.');
      setShowReview(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to register another participant
  const handleRegisterAnother = () => {
    setFormData({
      name: '',
      registerNumber: '',
      department: '',
      section: '',
      phone: '',
      email: ''
    });
    setErrors({});
    setSubmissionError('');
    setSuccessData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If already registered successfully, show SuccessCard
  if (successData) {
    return (
      <SuccessCard
        registrationData={successData}
        onGoHome={onNavigateHome}
        onRegisterAnother={handleRegisterAnother}
      />
    );
  }

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Back button */}
      <button
        onClick={onNavigateHome}
        className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>BACK TO HOME</span>
      </button>

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-block px-3 py-1 rounded-full bg-[#181818] border border-[#2e2e2e] text-xs font-mono font-bold tracking-widest text-[#e50914] uppercase mb-3">
          OFFICIAL PARTICIPANT FORM
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-cinematic uppercase tracking-tight text-white mb-3">
          REGISTER FOR {EVENT_CONFIG.titlePrefix} <span className="text-[#e50914]">{EVENT_CONFIG.titleYear}</span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-400">
          Enter your details and join our official WhatsApp group to complete registration.
        </p>
      </div>

      {/* Global Submission Error Message */}
      {submissionError && (
        <div className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 flex items-start space-x-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-300">REGISTRATION FAILED</div>
            <div>{submissionError}</div>
          </div>
        </div>
      )}

      {/* Top 5 Winners & Virtual Vanguards Incentive Banner */}
      <WhyJoinSection compact={true} />

      {/* Registration Card Form */}
      <div className="bg-[#121212] border border-[#242424] rounded-2xl p-6 sm:p-10 shadow-2xl">
        <form onSubmit={handleOpenReview} noValidate className="space-y-6">
          
          {/* Section: Participant Details */}
          <div>
            <h2 className="text-lg font-bold font-cinematic uppercase tracking-wider text-white border-b border-[#222] pb-3 mb-6 flex items-center justify-between">
              <span>PARTICIPANT DETAILS</span>
              <span className="text-xs font-sans font-normal text-neutral-500">* All fields required</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Field 1: Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  FULL NAME <span className="text-[#e50914]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-lg bg-[#181818] border text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] transition-all ${
                    errors.name ? 'border-red-500 bg-red-950/10' : 'border-[#2d2d2d] focus:border-[#e50914]'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Field 2: Register Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  REGISTER NUMBER <span className="text-[#e50914]">*</span>
                </label>
                <input
                  type="text"
                  name="registerNumber"
                  value={formData.registerNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your register number"
                  className={`w-full px-4 py-3 rounded-lg bg-[#181818] border text-white uppercase placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] transition-all font-mono ${
                    errors.registerNumber ? 'border-red-500 bg-red-950/10' : 'border-[#2d2d2d] focus:border-[#e50914]'
                  }`}
                />
                {errors.registerNumber && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.registerNumber}</span>
                  </p>
                )}
              </div>

              {/* Field 3: Department */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  DEPARTMENT <span className="text-[#e50914]">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-[#181818] border text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] transition-all ${
                    errors.department ? 'border-red-500 bg-red-950/10' : 'border-[#2d2d2d] focus:border-[#e50914]'
                  }`}
                >
                  <option value="" className="bg-[#181818] text-neutral-500">
                    Select your department
                  </option>
                  {EVENT_CONFIG.departments.map((dept, idx) => (
                    <option key={idx} value={dept} className="bg-[#181818] text-white">
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.department}</span>
                  </p>
                )}
              </div>

              {/* Field 4: Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  SECTION <span className="text-[#e50914]">*</span>
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-[#181818] border text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] transition-all ${
                    errors.section ? 'border-red-500 bg-red-950/10' : 'border-[#2d2d2d] focus:border-[#e50914]'
                  }`}
                >
                  <option value="" className="bg-[#181818] text-neutral-500">
                    Select your section
                  </option>
                  {EVENT_CONFIG.sections.map((sec, idx) => (
                    <option key={idx} value={sec} className="bg-[#181818] text-white">
                      {sec}
                    </option>
                  ))}
                </select>
                {errors.section && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.section}</span>
                  </p>
                )}
              </div>

              {/* Field 5: Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  PHONE NUMBER <span className="text-[#e50914]">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit mobile number"
                  className={`w-full px-4 py-3 rounded-lg bg-[#181818] border text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] transition-all font-mono ${
                    errors.phone ? 'border-red-500 bg-red-950/10' : 'border-[#2d2d2d] focus:border-[#e50914]'
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Field 6: Email */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  EMAIL ADDRESS <span className="text-[#e50914]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your college or personal email"
                  className={`w-full px-4 py-3 rounded-lg bg-[#181818] border text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] transition-all ${
                    errors.email ? 'border-red-500 bg-red-950/10' : 'border-[#2d2d2d] focus:border-[#e50914]'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* WhatsApp Group Section (Replaced Payment) */}
          <WhatsAppSection />

          {/* Submit Button */}
          <div className="pt-6 border-t border-[#262626]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-[#e50914] hover:bg-[#b80710] text-white font-extrabold tracking-wider uppercase text-base shadow-[0_0_25px_rgba(229,9,20,0.4)] hover:shadow-[0_0_35px_rgba(229,9,20,0.65)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clapperboard className="w-5 h-5" />
              <span>SUBMIT REGISTRATION</span>
            </button>
            <p className="text-center text-xs text-neutral-500 mt-3">
              You will have a chance to review your details before final submission.
            </p>
          </div>

        </form>
      </div>

      {/* Review Modal Step */}
      <ReviewModal
        isOpen={showReview}
        formData={formData}
        onEdit={() => setShowReview(false)}
        onConfirm={handleConfirmSubmit}
        isSubmitting={isSubmitting}
      />

    </div>
  );
}
