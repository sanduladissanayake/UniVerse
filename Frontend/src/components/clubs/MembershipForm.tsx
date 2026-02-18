import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { membershipAPI } from "../../services/api";
import { StripePaymentModal } from "../payment/StripePaymentModal";

interface MembershipFormProps {
  isOpen: boolean;
  onClose: () => void;
  clubId: number;
  clubName: string;
  membershipFee?: number;
  onSuccess?: () => void;
  paymentAlreadyCompleted?: boolean;
}

export interface MembershipFormData {
  fullName: string;
  contactNumber: string;
  address: string;
  birthday: string;
  faculty: string;
  year: string;
  skills: string[];
}

const SKILL_OPTIONS = [
  "Leadership",
  "Event Planning",
  "Public Speaking",
  "Graphic Design",
  "Video Editing",
  "Photography",
  "Social Media Management",
  "Content Writing",
  "Web Development",
  "Marketing",
  "Finance Management",
  "Team Coordination"
];

// Local storage keys
const PAYMENT_INFO_KEY = "paymentCompleted";
const getFormStorageKey = (clubId: number) => `membership_form_${clubId}`;

export function MembershipForm({ 
  isOpen, 
  onClose, 
  clubId, 
  clubName, 
  membershipFee,
  onSuccess,
  paymentAlreadyCompleted = false
}: MembershipFormProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [faculty, setFaculty] = useState("");
  const [year, setYear] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(paymentAlreadyCompleted);
  const [paymentData, setPaymentData] = useState<any>(null);
  
  // Field-level validation states
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    address?: string;
    contactNumber?: string;
    birthday?: string;
    faculty?: string;
    year?: string;
    skills?: string;
  }>({});

  // Load form data and payment info when modal opens
  useEffect(() => {
    if (isOpen && user) {
      console.log("📋 MembershipForm opened for club:", clubId);
      
      // Check for payment info in sessionStorage (from PaymentSuccessPage redirect)
      const paymentInfo = sessionStorage.getItem(PAYMENT_INFO_KEY);
      if (paymentInfo) {
        try {
          const payment = JSON.parse(paymentInfo);
          console.log("✅ Found payment info in sessionStorage:", payment);
          
          if (payment.clubId === clubId) {
            setPaymentCompleted(true);
            setPaymentData(payment);
            // Clear the sessionStorage after reading
            sessionStorage.removeItem(PAYMENT_INFO_KEY);
          }
        } catch (e) {
          console.error("❌ Failed to parse payment info:", e);
        }
      }

      // Try to restore form data from localStorage
      const formStorageKey = getFormStorageKey(clubId);
      const savedFormData = localStorage.getItem(formStorageKey);
      if (savedFormData) {
        try {
          const formData = JSON.parse(savedFormData);
          console.log("✅ Restoring saved form data:", formData);
          
          setFullName(formData.fullName || "");
          setAddress(formData.address || "");
          setContactNumber(formData.contactNumber || "");
          setBirthday(formData.birthday || "");
          setFaculty(formData.faculty || "");
          setYear(formData.year || "");
          setSkills(formData.skills || []);
        } catch (e) {
          console.error("❌ Failed to restore form data:", e);
        }
      }
    }
  }, [isOpen, clubId, user]);

  if (!isOpen) return null;

  if (!user) {
    return null;
  }

  const handleSkillToggle = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
    // Clear skills error when user selects/deselects
    if (fieldErrors.skills) {
      setFieldErrors(prev => ({ ...prev, skills: undefined }));
    }
  };

  // Real-time validation handlers
  const handleFullNameChange = (value: string) => {
    setFullName(value);
    if (value.trim()) {
      const error = validateFullName(value);
      setFieldErrors(prev => ({ ...prev, fullName: error || undefined }));
    } else {
      setFieldErrors(prev => ({ ...prev, fullName: undefined }));
    }
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (value.trim()) {
      const error = validateAddress(value);
      setFieldErrors(prev => ({ ...prev, address: error || undefined }));
    } else {
      setFieldErrors(prev => ({ ...prev, address: undefined }));
    }
  };

  const handleContactNumberChange = (value: string) => {
    setContactNumber(value);
    if (value.trim()) {
      const error = validateContactNumber(value);
      setFieldErrors(prev => ({ ...prev, contactNumber: error || undefined }));
    } else {
      setFieldErrors(prev => ({ ...prev, contactNumber: undefined }));
    }
  };

  const handleBirthdayChange = (value: string) => {
    setBirthday(value);
    if (value) {
      const error = validateBirthday(value);
      setFieldErrors(prev => ({ ...prev, birthday: error || undefined }));
    } else {
      setFieldErrors(prev => ({ ...prev, birthday: undefined }));
    }
  };

  const handleFacultyChange = (value: string) => {
    setFaculty(value);
    if (value) {
      setFieldErrors(prev => ({ ...prev, faculty: undefined }));
    }
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    if (value) {
      setFieldErrors(prev => ({ ...prev, year: undefined }));
    }
  };

  // Validation helper functions
  const validateFullName = (name: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed) return "Full name is required";
    if (trimmed.length < 2) return "Full name must be at least 2 characters";
    if (trimmed.length > 100) return "Full name must be no more than 100 characters";
    if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) return "Full name can only contain letters, spaces, hyphens, and apostrophes";
    return null;
  };

  const validateAddress = (addr: string): string | null => {
    const trimmed = addr.trim();
    if (!trimmed) return "Address is required";
    if (trimmed.length < 5) return "Address must be at least 5 characters";
    if (trimmed.length > 200) return "Address must be no more than 200 characters";
    return null;
  };

  const validateContactNumber = (phone: string): string | null => {
    const trimmed = phone.trim();
    if (!trimmed) return "Contact number is required";
    // Accept: +94XXXXXXXXX, 0XXXXXXXXX, 94XXXXXXXXX (9-10 digits)
    const phonePattern = /^(\+94|0|94)[0-9]{9}$/;
    if (!phonePattern.test(trimmed)) {
      return "Please enter a valid contact number (e.g., 0771234567 or +94771234567)";
    }
    return null;
  };

  const validateBirthday = (date: string): string | null => {
    if (!date) return "Birthday is required";
    const birthDate = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (isNaN(birthDate.getTime())) return "Invalid birthday format";
    if (birthDate > today) return "Birthday cannot be in the future";
    if (age < 16) return "You must be at least 16 years old";
    if (age > 80) return "Please enter a valid birthday";
    return null;
  };

  const validateFaculty = (fac: string): string | null => {
    if (!fac || fac.trim() === "") return "Faculty is required";
    return null;
  };

  const validateYear = (yr: string): string | null => {
    if (!yr || yr.trim() === "") return "Year is required";
    return null;
  };

  const validateSkills = (skillsArray: string[]): string | null => {
    if (!skillsArray || skillsArray.length === 0) return "Please select at least one skill";
    if (skillsArray.length > 10) return "You can select a maximum of 10 skills";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check if payment is required and not completed
    if (membershipFee && membershipFee > 0 && !paymentCompleted) {
      setError("Please complete the payment first");
      return;
    }

    // Comprehensive validation
    let validationError: string | null = null;

    // Validate each field
    validationError = validateFullName(fullName);
    if (validationError) {
      setError(validationError);
      return;
    }

    validationError = validateAddress(address);
    if (validationError) {
      setError(validationError);
      return;
    }

    validationError = validateContactNumber(contactNumber);
    if (validationError) {
      setError(validationError);
      return;
    }

    validationError = validateBirthday(birthday);
    if (validationError) {
      setError(validationError);
      return;
    }

    validationError = validateFaculty(faculty);
    if (validationError) {
      setError(validationError);
      return;
    }

    validationError = validateYear(year);
    if (validationError) {
      setError(validationError);
      return;
    }

    validationError = validateSkills(skills);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Submit the membership form
    setIsSubmitting(true);
    try {
      let response;
      
      // Prepare the form data (trim all string values)
      const formData = {
        userId: user.id,
        clubId: clubId,
        fullName: fullName.trim(),
        address: address.trim(),
        contactNumber: contactNumber.trim(),
        birthday: birthday,
        faculty: faculty.trim(),
        year: year.trim(),
        skills: skills,
        paymentId: paymentData?.paymentId || null
      };
      
      console.log("📤 SUBMITTING FORM DATA:");
      console.log("  userId:", formData.userId);
      console.log("  clubId:", formData.clubId);
      console.log("  fullName:", formData.fullName);
      console.log("  address:", formData.address);
      console.log("  contactNumber:", formData.contactNumber);
      console.log("  birthday:", formData.birthday);
      console.log("  faculty:", formData.faculty);
      console.log("  year:", formData.year);
      console.log("  skills:", formData.skills);
      console.log("  paymentId:", formData.paymentId);
      
      // If payment was completed, use the joined-after-payment endpoint with full details
      if (membershipFee && membershipFee > 0 && paymentCompleted && paymentData) {
        console.log("💳 Submitting membership with payment ID:", paymentData.paymentId);
        response = await membershipAPI.joinClubAfterPaymentWithDetails(formData);
      } else {
        // Direct join for free clubs with full details
        console.log("✅ Submitting free membership form");
        response = await membershipAPI.joinClubWithDetails(formData);
      }
      
      console.log("📥 RESPONSE FROM SERVER:");
      console.log("  success:", response.success);
      console.log("  message:", response.message);
      console.log("  membership:", response.membership);
      
      if (response.success) {
        console.log("✅ Membership created successfully");
        // Reset and clear storage
        resetForm();
        clearFormStorage();
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorMsg = response.message || "Failed to submit application";
        console.error("❌ Membership creation failed:", errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || "Failed to submit membership application. Please try again.";
      console.error("❌ Error submitting form:", errorMsg);
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFullName("");
    setAddress("");
    setContactNumber("");
    setBirthday("");
    setFaculty("");
    setYear("");
    setSkills([]);
    setError("");
    setPaymentCompleted(false);
    setPaymentData(null);
  };

  const clearFormStorage = () => {
    const formStorageKey = getFormStorageKey(clubId);
    localStorage.removeItem(formStorageKey);
    console.log("🗑️ Cleared form data from storage");
  };

  const saveMembershipDataForPayment = () => {
    const formData = {
      userId: user.id,
      clubId: clubId,
      fullName: fullName,
      address: address,
      contactNumber: contactNumber,
      birthday: birthday,
      faculty: faculty,
      year: year,
      skills: skills
    };
    console.log("💾 Saving membership form data to sessionStorage for payment:", formData);
    sessionStorage.setItem("membershipFormData", JSON.stringify(formData));
  };

  const handlePaymentSuccess = () => {
    // Mark payment as completed
    console.log("✅ Payment completed successfully - membership will be created automatically");
    setPaymentCompleted(true);
    setShowPaymentModal(false);
    setError("");
    
    // Close the form modal after payment succeeds - membership is created automatically
    console.log("🔄 Closing membership form modal - membership created automatically by PaymentSuccessPage");
    setTimeout(() => {
      resetForm();
      clearFormStorage();
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }, 100);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto membership-form-content">
          <div className="bg-white border-2 border-teal-200 rounded-2xl p-8 shadow-2xl">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold text-teal-600">
                Join {clubName}
              </h2>
              <p className="text-gray-600">
                Complete your membership application
              </p>
            </div>

            {/* Membership Fee Notice */}
            {membershipFee && membershipFee > 0 && (
              <div className={`mb-6 p-4 border-2 rounded-lg flex items-start gap-3 ${
                paymentCompleted
                  ? 'bg-green-50 border-green-300'
                  : 'bg-teal-50 border-teal-300'
              }`}>
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  paymentCompleted ? 'text-green-600' : 'text-teal-600'
                }`} />
                <div>
                  <p className={`text-sm font-bold ${
                    paymentCompleted ? 'text-green-700' : 'text-teal-700'
                  }`}>
                    {paymentCompleted ? 'Payment Completed ✓' : 'Membership Fee Required'}
                  </p>
                  <p className={`text-sm mt-1 ${
                    paymentCompleted ? 'text-green-600' : 'text-teal-600'
                  }`}>
                    {paymentCompleted ? (
                      'You can now submit your membership application.'
                    ) : (
                      <>This club charges <span className="font-bold">LKR {membershipFee.toFixed(2)}</span> for membership. Payment will be processed securely through Stripe.</>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name - Full Width */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-gray-700 text-sm font-bold">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-teal-500 transition-all ${
                    fieldErrors.fullName 
                      ? 'border-red-400 bg-red-50' 
                      : 'border-gray-200 hover:border-teal-200'
                  }`}
                  required
                />
                {fieldErrors.fullName && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">⚠️ {fieldErrors.fullName}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label htmlFor="address" className="text-gray-700 text-sm font-bold">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="123 Main Street, Colombo"
                  rows={3}
                  className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-teal-500 transition-all resize-none ${
                    fieldErrors.address 
                      ? 'border-red-400 bg-red-50' 
                      : 'border-gray-200 hover:border-teal-200'
                  }`}
                  required
                />
                {fieldErrors.address && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">⚠️ {fieldErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Number */}
                <div className="space-y-2">
                  <label htmlFor="contactNumber" className="text-gray-700 text-sm font-bold">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contactNumber"
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => handleContactNumberChange(e.target.value)}
                    placeholder="0771234567"
                    className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-teal-500 transition-all ${
                      fieldErrors.contactNumber 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-gray-200 hover:border-teal-200'
                    }`}
                    required
                  />
                  {fieldErrors.contactNumber && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">⚠️ {fieldErrors.contactNumber}</p>
                  )}
                </div>

                {/* Birthday */}
                <div className="space-y-2">
                  <label htmlFor="birthday" className="text-gray-700 text-sm font-bold">
                    Birthday <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="birthday"
                    type="date"
                    value={birthday}
                    onChange={(e) => handleBirthdayChange(e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-gray-900 focus:outline-none focus:border-teal-500 transition-all ${
                      fieldErrors.birthday 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-gray-200 hover:border-teal-200'
                    }`}
                    required
                  />
                  {fieldErrors.birthday && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">⚠️ {fieldErrors.birthday}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Faculty */}
                <div className="space-y-2">
                  <label htmlFor="faculty" className="text-gray-700 text-sm font-bold">
                    Faculty <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="faculty"
                    value={faculty}
                    onChange={(e) => handleFacultyChange(e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-gray-900 focus:outline-none focus:border-teal-500 transition-all ${
                      fieldErrors.faculty 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-gray-200 hover:border-teal-200'
                    }`}
                    required
                  >
                    <option value="" className="bg-white text-gray-900">Select your faculty</option>
                    <option value="Faculty of Commerce & Management Studies" className="bg-white text-gray-900">Faculty of Commerce & Management Studies</option>
                    <option value="Faculty of Computing and Technology" className="bg-white text-gray-900">Faculty of Computing and Technology</option>
                    <option value="Faculty of Humanities" className="bg-white text-gray-900">Faculty of Humanities</option>
                    <option value="Faculty of Medicine" className="bg-white text-gray-900">Faculty of Medicine</option>
                    <option value="Faculty of Science" className="bg-white text-gray-900">Faculty of Science</option>
                    <option value="Faculty of Social Sciences" className="bg-white text-gray-900">Faculty of Social Sciences</option>
                  </select>
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <label htmlFor="year" className="text-gray-700 text-sm font-bold">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="year"
                    value={year}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-gray-900 focus:outline-none focus:border-teal-500 transition-all ${
                      fieldErrors.year 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-gray-200 hover:border-teal-200'
                    }`}
                    required
                  >
                    <option value="" className="bg-white text-gray-900">Select your year</option>
                    <option value="1st Year" className="bg-white text-gray-900">1st Year</option>
                    <option value="2nd Year" className="bg-white text-gray-900">2nd Year</option>
                    <option value="3rd Year" className="bg-white text-gray-900">3rd Year</option>
                    <option value="4th Year" className="bg-white text-gray-900">4th Year</option>
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-bold">
                  Skills <span className="text-red-500">*</span>
                </label>
                <p className="text-gray-500 text-xs mb-3">Select all that apply (max 10)</p>
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 p-3 rounded-lg ${
                  fieldErrors.skills ? 'bg-red-50 border-2 border-red-400' : 'bg-teal-50 border-2 border-teal-200'
                }`}>
                  {SKILL_OPTIONS.map((skill) => (
                    <label
                      key={skill}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                        skills.includes(skill)
                          ? "bg-teal-100 border-teal-400 text-gray-900"
                          : "bg-white border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={skills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-2 focus:ring-teal-500"
                        disabled={!skills.includes(skill) && skills.length >= 10}
                      />
                      <span className="text-sm font-medium">{skill}</span>
                    </label>
                  ))}
                </div>
                {fieldErrors.skills && (
                  <p className="text-red-500 text-xs mt-2 font-semibold">⚠️ {fieldErrors.skills}</p>
                )}
                {skills.length > 0 && !fieldErrors.skills && (
                  <p className="text-teal-600 text-xs mt-2 font-semibold">✓ {skills.length} skill(s) selected</p>
                )}
              </div>

              <div className="space-y-3">
                {/* Proceed to Payment Button (if fee exists and not paid) */}
                {membershipFee && membershipFee > 0 && !paymentCompleted && (
                  <button
                    type="button"
                    onClick={() => {
                      console.log("🔍 Validating form before payment...");
                      
                      // Validate before proceeding to payment
                      let hasErrors = false;
                      const errors: typeof fieldErrors = {};
                      let firstErrorField: string | null = null;
                      
                      const fullNameError = validateFullName(fullName);
                      if (fullNameError) {
                        console.warn("❌ Full Name Error:", fullNameError);
                        errors.fullName = fullNameError;
                        hasErrors = true;
                        if (!firstErrorField) firstErrorField = "fullName";
                      }
                      
                      const addressError = validateAddress(address);
                      if (addressError) {
                        console.warn("❌ Address Error:", addressError);
                        errors.address = addressError;
                        hasErrors = true;
                        if (!firstErrorField) firstErrorField = "address";
                      }
                      
                      const phoneError = validateContactNumber(contactNumber);
                      if (phoneError) {
                        console.warn("❌ Contact Number Error:", phoneError);
                        errors.contactNumber = phoneError;
                        hasErrors = true;
                        if (!firstErrorField) firstErrorField = "contactNumber";
                      }
                      
                      const birthdayError = validateBirthday(birthday);
                      if (birthdayError) {
                        console.warn("❌ Birthday Error:", birthdayError);
                        errors.birthday = birthdayError;
                        hasErrors = true;
                        if (!firstErrorField) firstErrorField = "birthday";
                      }
                      
                      const facultyError = validateFaculty(faculty);
                      if (facultyError) {
                        console.warn("❌ Faculty Error:", facultyError);
                        errors.faculty = facultyError;
                        hasErrors = true;
                        if (!firstErrorField) firstErrorField = "faculty";
                      }
                      
                      const yearError = validateYear(year);
                      if (yearError) {
                        console.warn("❌ Year Error:", yearError);
                        errors.year = yearError;
                        hasErrors = true;
                        if (!firstErrorField) firstErrorField = "year";
                      }
                      
                      const skillsError = validateSkills(skills);
                      if (skillsError) {
                        console.warn("❌ Skills Error:", skillsError);
                        errors.skills = skillsError;
                        hasErrors = true;
                        if (!firstErrorField) firstErrorField = "skills";
                      }
                      
                      if (hasErrors) {
                        console.error("❌ VALIDATION FAILED - Errors:", errors);
                        console.log("📍 First error field:", firstErrorField);
                        
                        // Set errors to display
                        setFieldErrors(errors);
                        setError("⚠️ Please fix all required fields before proceeding to payment");
                        
                        // Scroll form to top to show error message
                        const formElement = document.querySelector('.membership-form-content');
                        if (formElement) {
                          formElement.scrollTop = 0;
                          console.log("📜 Scrolled form to top");
                        }
                        
                        // Focus on first error field
                        if (firstErrorField) {
                          const firstErrorInput = document.getElementById(firstErrorField);
                          if (firstErrorInput) {
                            firstErrorInput.focus();
                            firstErrorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            console.log("🎯 Focused on field:", firstErrorField);
                          }
                        }
                        
                        return;
                      }
                      
                      console.log("✅ All validations passed - proceeding to payment");
                      setError("");
                      setFieldErrors({});
                      saveMembershipDataForPayment();
                      setShowPaymentModal(true);
                    }}
                    className="w-full py-3 bg-yellow-400 text-teal-900 rounded-lg hover:bg-yellow-300 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/50 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💳 Proceed to Payment (LKR {membershipFee.toFixed(2)})
                  </button>
                )}

                {/* Submit Membership Application Button - Only shown for free clubs or after successful payment */}
                {(!membershipFee || membershipFee === 0) && (
                  <button
                    type="submit"
                    disabled={isSubmitting || Object.keys(fieldErrors).some(key => fieldErrors[key as keyof typeof fieldErrors])}
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                      isSubmitting || Object.keys(fieldErrors).some(key => fieldErrors[key as keyof typeof fieldErrors])
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                        : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/50'
                    }`}
                  >
                    {isSubmitting ? "Processing..." : "Submit Application"}
                  </button>
                )}

                {membershipFee && membershipFee > 0 && paymentCompleted && (
                  <button
                    type="submit"
                    disabled={isSubmitting || Object.keys(fieldErrors).some(key => fieldErrors[key as keyof typeof fieldErrors])}
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                      isSubmitting || Object.keys(fieldErrors).some(key => fieldErrors[key as keyof typeof fieldErrors])
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                        : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/50'
                    }`}
                  >
                    {isSubmitting ? "Processing..." : "✅ Complete Membership"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {membershipFee && membershipFee > 0 && (
        <StripePaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          userId={user.id}
          clubId={clubId}
          clubName={clubName}
          membershipFee={membershipFee}
          onPaymentSuccess={handlePaymentSuccess}
          autoCreateMembership={false}
        />
      )}
    </>
  );
}