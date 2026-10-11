import React, { useState } from 'react';
import { Clapperboard, AlertCircle, ArrowLeft } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';
import WhatsAppSection from '../components/WhatsAppSection';
import ReviewModal from '../components/ReviewModal';
import SuccessCard from '../components/SuccessCard';
import WhyJoinSection from '../components/WhyJoinSection';
import { supabase } from '../config/supabaseClient';

export default function Register({ onNavigateHome }) {
  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    department: '',
    section: '',
    phone: '',
    email: '',
    festSkill: ''
  });

  // Custom typed department when "Other" is chosen
  const [otherDepartment, setOtherDepartment] = useState('');

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
    } else if (formData.department === 'Other' && !otherDepartment.trim()) {
      newErrors.otherDepartment = 'Please enter your department name.';
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

    // Fest Skill validation
    if (!formData.festSkill) {
      newErrors.festSkill = 'Please select your Fest Skill.';
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

    const resolvedDepartment =
      formData.department === 'Other' && otherDepartment.trim()
        ? otherDepartment.trim()
        : formData.department;

    const submissionPayload = {
      ...formData,
      department: resolvedDepartment
    };

    try {
      let finalData = null;

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(submissionPayload)
        });

        if (response.ok) {
          const resJson = await response.json();
          finalData = resJson.data;
        } else if (response.status === 409) {
          setSubmissionError('This register number is already registered for Frame Fest ’26.');
          setShowReview(false);
          setIsSubmitting(false);
          return;
        } else {
          throw new Error('API request failed, attempting direct database sync');
        }
      } catch (apiErr) {
        // Fallback directly to Supabase (e.g. GitHub Pages or static host)
        try {
          // Check duplicate in Supabase
          const { data: dupCheck } = await supabase
            .from('registrations')
            .select('id')
            .ilike('register_number', formData.registerNumber.trim());

          if (dupCheck && dupCheck.length > 0) {
            setSubmissionError('This register number is already registered for Frame Fest ’26.');
            setShowReview(false);
            setIsSubmitting(false);
            return;
          }

          // Query existing records to find the MAXIMUM sequential Ticket ID
          const { data: allRegs, error: fetchErr } = await supabase
            .from('registrations')
            .select('registration_id');

          let maxNum = 0;
          if (!fetchErr && Array.isArray(allRegs)) {
            for (const r of allRegs) {
              const m = (r.registration_id || '').match(/FF26-(\d+)/i);
              if (m) {
                const n = parseInt(m[1], 10);
                if (!isNaN(n) && n > maxNum) maxNum = n;
              }
            }
          }

          let candidateNum = Math.max(maxNum, 27) + 1;
          const now = new Date();
          const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

          let insertedRecord = null;
          let passId = '';

          for (let attempt = 0; attempt < 5; attempt++) {
            passId = `FF26-${String(candidateNum).padStart(4, '0')}`;
            const dbRow = {
              registration_id: passId,
              name: formData.name.trim(),
              register_number: formData.registerNumber.trim().toUpperCase(),
              department: resolvedDepartment,
              section: formData.section.trim(),
              fest_skill: formData.festSkill,
              phone: formData.phone.replace(/\D/g, ''),
              email: formData.email.trim().toLowerCase(),
              created_at: now.toISOString(),
              registration_date: formattedDate,
              attendance_status: 'PENDING',
              whatsapp_joined: true,
              status: 'CONFIRMED'
            };

            const { data: inserted, error: insertError } = await supabase
              .from('registrations')
              .insert([dbRow])
              .select();

            if (!insertError && inserted && inserted.length > 0) {
              insertedRecord = inserted[0];
              break;
            }

            if (insertError && (insertError.code === '23505' || insertError.message?.includes('duplicate key'))) {
              if (insertError.message?.includes('register_number')) {
                setSubmissionError('This register number is already registered for Frame Fest ’26.');
                setShowReview(false);
                setIsSubmitting(false);
                return;
              }
              candidateNum++;
            } else {
              throw insertError;
            }
          }

          if (!insertedRecord) {
            throw new Error('Could not assign ticket ID, please try again.');
          }

          finalData = {
            registrationId: passId,
            ticketId: passId,
            ...submissionPayload,
            registrationDate: formattedDate,
            createdAt: now.toISOString(),
            status: 'CONFIRMED'
          };
        } catch (dbErr) {
          if (dbErr?.code === '23505' && dbErr?.message?.includes('register_number')) {
            setSubmissionError('This register number is already registered for Frame Fest ’26.');
            setShowReview(false);
            setIsSubmitting(false);
            return;
          }
          console.warn('Direct Supabase write issue, using local storage backup:', dbErr);
          const passId = `FF26-${Math.floor(100000 + Math.random() * 900000)}`;
          const localRecord = {
            ...submissionPayload,
            registrationId: passId,
            ticketId: passId,
            status: 'CONFIRMED',
            registrationDate: new Date().toISOString()
          };

          const existing = JSON.parse(localStorage.getItem('frame_fest_registrations') || '[]');
          if (existing.some(r => (r.registerNumber || '').trim().toLowerCase() === formData.registerNumber.trim().toLowerCase())) {
            setSubmissionError('This register number is already registered for Frame Fest ’26.');
            setShowReview(false);
            setIsSubmitting(false);
            return;
          }
          existing.push(localRecord);
          localStorage.setItem('frame_fest_registrations', JSON.stringify(existing));
          finalData = localRecord;
        }
      }

      // Success
      setShowReview(false);
      setSuccessData(finalData);
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
    setOtherDepartment('');
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

  // Resolved department for ReviewModal preview
  const displayDepartment =
    formData.department === 'Other' && otherDepartment.trim()
      ? otherDepartment.trim()
      : formData.department;

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Review Modal */}
      <ReviewModal
        isOpen={showReview}
        formData={{ ...formData, department: displayDepartment }}
        onEdit={() => setShowReview(false)}
        onConfirm={handleConfirmSubmit}
        isSubmitting={isSubmitting}
      />
      
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
        <div className="inline-block px-3 py-1 rounded-full bg-[#18122c] border border-[#2d224e] text-xs font-mono font-bold tracking-widest text-[#c084fc] uppercase mb-3">
          OFFICIAL PARTICIPANT FORM
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-cinematic uppercase tracking-tight text-white mb-3">
          REGISTER FOR {EVENT_CONFIG.titlePrefix} <span className="text-[#a855f7]">{EVENT_CONFIG.titleYear}</span>
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
      <div className="bg-[#130f24]/85 backdrop-blur-md border border-[#2a1f49]/80 rounded-2xl p-6 sm:p-10 shadow-2xl">
        <form onSubmit={handleOpenReview} noValidate className="space-y-6">
          
          {/* Section: Participant Details */}
          <div>
            <h2 className="text-lg font-bold font-cinematic uppercase tracking-wider text-white border-b border-[#251b3f] pb-3 mb-6 flex items-center justify-between">
              <span>PARTICIPANT DETAILS</span>
              <span className="text-xs font-sans font-normal text-neutral-500">* All fields required</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Field 1: Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  FULL NAME <span className="text-[#c084fc]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-lg bg-[#18122c] border text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] transition-all ${
                    errors.name ? 'border-red-500 bg-red-950/10' : 'border-[#2f2352] focus:border-[#8b5cf6]'
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
                  REGISTER NUMBER <span className="text-[#c084fc]">*</span>
                </label>
                <input
                  type="text"
                  name="registerNumber"
                  value={formData.registerNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your register number"
                  className={`w-full px-4 py-3 rounded-lg bg-[#18122c] border text-white uppercase placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] transition-all font-mono ${
                    errors.registerNumber ? 'border-red-500 bg-red-950/10' : 'border-[#2f2352] focus:border-[#8b5cf6]'
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
              <div className={formData.department === 'Other' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  DEPARTMENT <span className="text-[#c084fc]">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-[#18122c] border text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] transition-all ${
                    errors.department ? 'border-red-500 bg-red-950/10' : 'border-[#2f2352] focus:border-[#8b5cf6]'
                  }`}
                >
                  <option value="" className="bg-[#18122c] text-neutral-500">
                    Select your department
                  </option>
                  {EVENT_CONFIG.departments.map((dept, idx) => (
                    <option key={idx} value={dept} className="bg-[#18122c] text-white">
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

                {/* Explicit input to type custom department name when "Other" is chosen */}
                {formData.department === 'Other' && (
                  <div className="mt-3 animate-fadeIn">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#c084fc] mb-1.5">
                      ENTER YOUR DEPARTMENT NAME <span className="text-[#c084fc]">*</span>
                    </label>
                    <input
                      type="text"
                      value={otherDepartment}
                      onChange={(e) => {
                        setOtherDepartment(e.target.value);
                        if (errors.otherDepartment) {
                          setErrors((prev) => ({ ...prev, otherDepartment: '' }));
                        }
                      }}
                      placeholder="e.g. Biotechnology, Robotics & Automation..."
                      className={`w-full px-4 py-3 rounded-lg bg-[#151026] border text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] transition-all ${
                        errors.otherDepartment ? 'border-red-500 bg-red-950/10' : 'border-[#8b5cf6]/40 focus:border-[#8b5cf6]'
                      }`}
                      autoFocus
                    />
                    {errors.otherDepartment && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.otherDepartment}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Field 4: Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  SECTION <span className="text-[#c084fc]">*</span>
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-[#18122c] border text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] transition-all ${
                    errors.section ? 'border-red-500 bg-red-950/10' : 'border-[#2f2352] focus:border-[#8b5cf6]'
                  }`}
                >
                  <option value="" className="bg-[#18122c] text-neutral-500">
                    Select your section
                  </option>
                  {EVENT_CONFIG.sections.map((sec, idx) => (
                    <option key={idx} value={sec} className="bg-[#18122c] text-white">
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
                  PHONE NUMBER <span className="text-[#c084fc]">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit mobile number"
                  className={`w-full px-4 py-3 rounded-lg bg-[#18122c] border text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] transition-all font-mono ${
                    errors.phone ? 'border-red-500 bg-red-950/10' : 'border-[#2f2352] focus:border-[#8b5cf6]'
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
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  EMAIL ADDRESS <span className="text-[#c084fc]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 rounded-lg bg-[#18122c] border text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] transition-all ${
                    errors.email ? 'border-red-500 bg-red-950/10' : 'border-[#2f2352] focus:border-[#8b5cf6]'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Field 7: Fest Skills (Near Email) */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                    FEST SKILLS <span className="text-[#c084fc]">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#c084fc] font-semibold">
                    SELECT 1 OF 6 CATEGORIES
                  </span>
                </div>
                <select
                  name="festSkill"
                  value={formData.festSkill}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3.5 rounded-lg bg-[#18122c] border text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] transition-all ${
                    errors.festSkill ? 'border-red-500 bg-red-950/10' : 'border-[#2f2352] focus:border-[#8b5cf6]'
                  }`}
                >
                  <option value="" className="bg-[#18122c] text-neutral-500">
                    Choose your Fest Skill / Category...
                  </option>
                  {EVENT_CONFIG.festSkillOptions.map((skill, idx) => (
                    <option key={idx} value={skill} className="bg-[#18122c] text-white">
                      {idx + 1}. {skill}
                    </option>
                  ))}
                </select>
                {errors.festSkill ? (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.festSkill}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-neutral-400 mt-1.5">
                    Options: Videography • Video Editing • Photography • Photo Editing • Poster Designing • Web Designing
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* WhatsApp Group Section (Replaced Payment) */}
          <WhatsAppSection />

          {/* Submit Button */}
          <div className="pt-6 border-t border-[#251b3f]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-extrabold tracking-wider uppercase text-base shadow-[0_0_25px_rgba(139,92,246,0.45)] hover:shadow-[0_0_35px_rgba(139,92,246,0.7)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

    </div>
  );
}
