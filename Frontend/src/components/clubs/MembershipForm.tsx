import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { membershipAPI } from "../../services/api";

interface MembershipFormProps {
  isOpen: boolean;
  onClose: () => void;
  clubId: number;
  clubName: string;
  onSuccess?: () => void;
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

export function MembershipForm({ isOpen, onClose, clubId, clubName, onSuccess }: MembershipFormProps) {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName || !contactNumber || !address || !birthday || !faculty || !year) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate contact number (Sri Lankan format)
    const phonePattern = /^(\+94|0)?[0-9]{9,10}$/;
    if (!phonePattern.test(contactNumber)) {
      setError("Please enter a valid contact number");
      return;
    }

    if (skills.length === 0) {
      setError("Please select at least one skill");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData: MembershipFormData = {
        fullName,
        contactNumber,
        address,
        birthday,
        faculty,
        year,
        skills
      };

      const response = await membershipAPI.joinClub(user.id, clubId);
      
      if (response.success) {
        // Reset form
        setFullName("");
        setContactNumber("");
        setAddress("");
        setBirthday("");
        setFaculty("");
        setYear("");
        setSkills([]);
        setError("");
        
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || "Failed to submit application");
      }
    } catch (err) {
      setError("Failed to submit membership application. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
    setFullName("");
    setAddress("");
    setContactNumber("");
    setBirthday("");
    setFaculty("");
    setYear("");
    setSkills([]);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Join {clubName}
            </h2>
            <p className="text-white/70">
              Complete your membership application
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name - Full Width */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-white text-sm font-medium">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label htmlFor="address" className="text-white text-sm font-medium">
                Address <span className="text-red-400">*</span>
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main Street, Colombo"
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Number */}
              <div className="space-y-2">
                <label htmlFor="contactNumber" className="text-white text-sm font-medium">
                  Contact Number <span className="text-red-400">*</span>
                </label>
                <input
                  id="contactNumber"
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="0771234567"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Birthday */}
              <div className="space-y-2">
                <label htmlFor="birthday" className="text-white text-sm font-medium">
                  Birthday <span className="text-red-400">*</span>
                </label>
                <input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Faculty */}
              <div className="space-y-2">
                <label htmlFor="faculty" className="text-white text-sm font-medium">
                  Faculty <span className="text-red-400">*</span>
                </label>
                <select
                  id="faculty"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="" className="bg-gray-900">Select your faculty</option>
                  <option value="Faculty of Commerce & Management Studies" className="bg-gray-900">Faculty of Commerce & Management Studies</option>
                  <option value="Faculty of Computing and Technology" className="bg-gray-900">Faculty of Computing and Technology</option>
                  <option value="Faculty of Humanities" className="bg-gray-900">Faculty of Humanities</option>
                  <option value="Faculty of Medicine" className="bg-gray-900">Faculty of Medicine</option>
                  <option value="Faculty of Science" className="bg-gray-900">Faculty of Science</option>
                  <option value="Faculty of Social Sciences" className="bg-gray-900">Faculty of Social Sciences</option>
                </select>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label htmlFor="year" className="text-white text-sm font-medium">
                  Year <span className="text-red-400">*</span>
                </label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="" className="bg-gray-900">Select your year</option>
                  <option value="1st Year" className="bg-gray-900">1st Year</option>
                  <option value="2nd Year" className="bg-gray-900">2nd Year</option>
                  <option value="3rd Year" className="bg-gray-900">3rd Year</option>
                  <option value="4th Year" className="bg-gray-900">4th Year</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">
                Skills <span className="text-red-400">*</span>
              </label>
              <p className="text-white/50 text-xs mb-3">Select all that apply</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SKILL_OPTIONS.map((skill) => (
                  <label
                    key={skill}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                      skills.includes(skill)
                        ? "bg-blue-500/20 border-blue-500"
                        : "bg-white/5 border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={skills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="w-4 h-4 rounded border-white/20 text-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}