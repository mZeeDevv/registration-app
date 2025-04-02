import { useLocation, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import fullLogo from "../assets/full-logo.png";
import procareLogo from "../assets/procare-logo.png";

const RegistrationConfirmationPage = () => {
  const location = useLocation();
  const { fullName, email, mobileNumber, attendeeId, documentId, qrCodeUrl } =
    location.state || {};
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    // In a real app, you might retrieve data from an API rather than location state
    if (location.state) {
      setRegistrationData(location.state);
    }
  }, [location]);

  if (!attendeeId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Registration Information Not Found
          </h2>
          <p className="text-secondary-600 mb-6">
            Please complete the registration process to continue.
          </p>
          <Link
            to="/registration"
            className="block w-full bg-primary-600 text-white text-center px-4 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Go to Registration
          </Link>
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Screen version */}
        <div className="bg-white rounded-2xl shadow-card border border-secondary-100 p-8 text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="font-display text-3xl font-bold text-secondary-900 mb-4">
            Registration Successful!
          </h1>

          <p className="text-secondary-600 mb-8">
            Thank you for registering for NepDent IDS 2025. Your registration
            has been confirmed.
          </p>

          <div className="bg-secondary-50 p-6 rounded-xl mb-8">
            <div className="mb-4">
              <p className="text-sm text-secondary-500">Attendee Name</p>
              <p className="font-medium text-secondary-900">{fullName}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-secondary-500">Mobile Number</p>
              <p className="font-medium text-secondary-900">{mobileNumber}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-secondary-500">Email Address</p>
              <p className="font-medium text-secondary-900">{email}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-secondary-500">Attendee ID</p>
              <p className="font-medium text-secondary-900">{attendeeId}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              Your Check-In QR Code
            </h2>
            <div className="bg-white p-4 inline-block rounded-xl border border-secondary-200">
              <QRCodeSVG value={qrCodeUrl} size={200} />
            </div>
            <p className="text-sm text-secondary-500 mt-3">
              Please save this QR code and present it at the event entrance.
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              to="/"
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmationPage;
