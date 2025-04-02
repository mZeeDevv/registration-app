import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, doc, getDoc, query, where, getDocs } from 'firebase/firestore'; 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react'; // Fix: correct import for qrcode.react
import { LockIcon } from 'lucide-react';

// Countries data
const countries = [
  "Nepal", "India", "Germany", "United States", "United Kingdom", "France", "China", "Japan", 
  "Australia", "Canada", "Brazil", "South Africa", "Russia", "Italy", "Spain", "Singapore", 
  "Malaysia", "Thailand", "South Korea", "Other"
].sort();

// SearchableDropdown Component
const SearchableDropdown = ({ value, onChange, onBlur }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country) => {
    onChange({ target: { name: 'country', value: country } });
    setIsOpen(false);
    setSearchTerm('');
    if (onBlur) onBlur();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus-within:ring-2 focus-within:ring-primary-300 focus-within:border-primary-300 transition-colors bg-white cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => searchRef.current?.focus(), 100);
          }
        }}
      >
        <div className="flex justify-between items-center">
          <span className={value ? 'text-secondary-900' : 'text-secondary-400'}>
            {value || 'Select your country'}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-secondary-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-secondary-200 rounded-xl shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-secondary-100">
            <input
              ref={searchRef}
              type="text"
              className="w-full px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country}
                  className={`px-4 py-2 cursor-pointer text-sm hover:bg-primary-50 transition-colors ${
                    value === country ? 'bg-primary-50 text-primary-600' : 'text-secondary-700'
                  }`}
                  onClick={() => handleSelect(country)}
                >
                  {country}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-secondary-500">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState([]);
  const [registrationsEnabled, setRegistrationsEnabled] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    company: '',
    jobTitle: '',
    country: '',
    interests: []
  });

  // Fetch settings and interests from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch registration status
        const generalSettingsDoc = await getDoc(doc(db, 'settings', 'general'));
        if (generalSettingsDoc.exists()) {
          setRegistrationsEnabled(generalSettingsDoc.data().registrationsEnabled ?? true);
        }

        // Fetch interests
        const interestsDoc = await getDoc(doc(db, 'settings', 'interests'));
        if (interestsDoc.exists()) {
          setInterests(interestsDoc.data().list || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load registration form');
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return { ...prev, interests: [...prev.interests, value] };
      } else {
        return { ...prev, interests: prev.interests.filter(interest => interest !== value) };
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!registrationsEnabled) {
      toast.error('Registration is currently closed');
      return;
    }

    // Form validation
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.mobileNumber.trim()) {
      toast.error('Please enter your mobile number');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!formData.company.trim()) {
      toast.error('Please enter your company/organization');
      return;
    }
    if (!formData.jobTitle.trim()) {
      toast.error('Please enter your job title');
      return;
    }
    if (!formData.country) {
      toast.error('Please select your country');
      return;
    }
    if (formData.interests.length === 0) {
      toast.error('Please select at least one area of interest');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Processing your registration...');

    try {
      // Check if email already exists
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', formData.email.trim()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Email already exists
        toast.dismiss(loadingToast);
        toast.error('This email address is already registered. Please use a different email.');
        return;
      }
      
      // Generate a custom document ID
      const customId = `NEPDENT-${Math.floor(10000 + Math.random() * 90000)}`;

      // Save data to Firestore with custom ID
      const docRef = await addDoc(collection(db, 'users'), {
        ...formData,
        createdAt: new Date(), // Add a timestamp
        uid: customId,
        cardPrinted: false,
        checkedIn: false
      });

      // Create notification for admin
      await addDoc(collection(db, 'notifications'), {
        type: 'NEW_REGISTRATION',
        userId: docRef.id,
        title: 'New Registration',
        message: `${formData.fullName} from ${formData.company} has registered`,
        timestamp: new Date(),
        isRead: false,
        metadata: {
          attendeeId: customId,
          email: formData.email,
          company: formData.company
        }
      });

      // Generate QR code URL with the Firestore document ID
      const qrCodeUrl = `https://nepdent.netlify.app/check-in/${docRef.id}`;
      
      // Update the document with the QR code URL
      await updateDoc(doc(db, 'users', docRef.id), {
        qrCodeUrl: qrCodeUrl
      });

      // Dismiss loading toast and show success message
      toast.dismiss(loadingToast);
      toast.success('Registration successful! Redirecting to confirmation page...');

      // Navigate to confirmation page with custom ID and QR code URL
      navigate('/registration-confirmation', {
        state: {
          ...formData,
          attendeeId: customId, // Use custom ID as attendee ID
          documentId: docRef.id, // Pass the Firestore document ID
          qrCodeUrl: qrCodeUrl // Pass QR code URL to confirmation page
        }
      });
    } catch (error) {
      // Handle errors
      toast.dismiss(loadingToast);
      toast.error('Registration failed. Please try again.');
      console.error('Error adding document: ', error);
    }
  };

  if (!registrationsEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-card border border-secondary-100 p-8">
            <LockIcon className="h-16 w-16 mx-auto text-secondary-400" />
            <h2 className="mt-4 text-2xl font-bold text-secondary-900">Registration Closed</h2>
            <p className="mt-2 text-secondary-600">
              Registration for NEPDENT DTS 2025 is currently closed. Please check back later or contact the organizers for more information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 py-12">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-secondary-900 mb-2">
            Register for Event Name 2025
          </h1>
          <p className="text-secondary-600 text-lg max-w-2xl mx-auto">
            Join us in "EVENT LOCATION" 2025 for the premier  event in "COUNTRY NAME".
          </p>
        </div>

        {/* Registration form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-2xl shadow-card border border-secondary-100 p-6 md:p-8 transition-all duration-300 hover:shadow-xl"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-secondary-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-colors"
                placeholder="Your full name"
                autoComplete="off"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-semibold text-secondary-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-colors"
                placeholder="Your mobile number"
                autoComplete="off"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-secondary-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-colors"
                placeholder="you@example.com"
                autoComplete="off"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-semibold text-secondary-700 mb-1">
                Company/Organization *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-colors"
                placeholder="Your organization"
                autoComplete="off"
              />
            </div>

            {/* Job Title */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-semibold text-secondary-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-colors"
                placeholder="Your role"
                autoComplete="off"
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-secondary-700 mb-1">
                Country *
              </label>
              <SearchableDropdown
                value={formData.country}
                onChange={handleChange}
                onBlur={() => {}}
              />
            </div>
          </div>

          {/* Interests */}
          <div className="mt-8">
            <p className="block text-sm font-semibold text-secondary-700 mb-3">Areas of Interest (select all that apply)</p>
            <div className="bg-secondary-50 p-5 rounded-xl border border-secondary-100">
              <div className="grid md:grid-cols-2 gap-4">
                {interests.map(interest => (
                  <div key={interest} className="group relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id={interest}
                        name="interests"
                        value={interest}
                        checked={formData.interests.includes(interest)}
                        onChange={handleCheckbox}
                        className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-colors cursor-pointer"
                      />
                    </div>
                    <div className="ml-2 flex items-center">
                      <label 
                        htmlFor={interest} 
                        className="text-secondary-700 group-hover:text-primary-600 transition-colors cursor-pointer text-sm"
                      >
                        {interest}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-10 text-center">
            <button
              type="submit"
              className="bg-primary-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:bg-primary-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Complete Registration
            </button>
            <p className="text-sm text-secondary-500 mt-4">
              By registering, you agree to our <a href="#" className="text-primary-600 hover:text-primary-700 underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;