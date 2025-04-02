import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const DigitalPassPage = () => {
  const location = useLocation();
  const [attendeeData, setAttendeeData] = useState(null);
  
  useEffect(() => {
    if (location.state) {
      setAttendeeData(location.state);
    }
    // In a real app, you might fetch the data using an ID from the URL
  }, [location]);

  const handlePrint = () => {
    window.print();
  };
  
  if (!attendeeData) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4">
        <div className="bg-secondary-50 border border-secondary-200 rounded-2xl p-8 shadow-card">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-secondary-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold font-display text-secondary-900 mb-3">Digital Pass Data Not Found</h2>
          <p className="text-secondary-600 mb-6">Please complete the registration form to access your digital pass.</p>
          <Link 
            to="/register" 
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl shadow-md hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            Register Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 bg-primary-100 rounded-full opacity-70 blur-3xl z-0"></div>
      <div className="absolute bottom-0 right-0 -mr-16 -mb-16 w-72 h-72 bg-accent-50 rounded-full opacity-50 blur-3xl z-0"></div>
      
      <div className="relative z-10">
        {/* Non-printable controls */}
        <div className="mb-6 flex justify-between print:hidden">
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-secondary-100 text-secondary-700 font-medium rounded-xl hover:bg-secondary-200 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <button 
            onClick={handlePrint}
            className="inline-flex items-center px-6 py-2 bg-primary-600 text-white font-medium rounded-xl shadow-md hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Pass
          </button>
        </div>
        
        {/* Digital Pass Card - this will be printed */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 border border-secondary-100 print:border-neutral-700 print:shadow-none">
          {/* Event name at the top */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 text-center">
            <h2 className="text-xl font-display font-bold print:text-black">Dental Trade Show 2025</h2>
            <div className="flex items-center justify-center mt-2 text-sm text-primary-100 space-x-4">
              <div className="flex items-center print:text-neutral-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>April 18-20, 2025</span>
              </div>
              <div className="flex items-center print:text-neutral-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Kathmandu, Nepal</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="bg-secondary-50 p-4 rounded-xl border border-secondary-100 shadow-inner w-48 h-48 flex items-center justify-center relative">
                  <div className="w-40 h-40 relative">
                    {/* QR Code Border Animation */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary-300 via-accent-500 to-primary-300 rounded-lg opacity-50 animate-pulse"></div>
                    {/* This would be an actual QR code in a production app */}
                    <div className="relative bg-white border-2 border-secondary-200 w-full h-full grid grid-cols-6 grid-rows-6 gap-0.5 p-3 rounded-lg">
                      {Array(36).fill().map((_, i) => (
                        <div 
                          key={i} 
                          className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-center text-secondary-600 bg-primary-50 rounded-full px-3 py-1">
                  <span className="font-medium">Scan for verification</span>
                </div>
              </div>
              
              {/* Attendee Information */}
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-secondary-700 uppercase tracking-wider border-b border-secondary-100 pb-2 mb-4">
                  Attendee Information
                </h3>
                
                <h3 className="text-2xl font-bold text-secondary-900">
                  {attendeeData.firstName} {attendeeData.lastName}
                </h3>
                
                <div className="flex items-center mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-secondary-700">{attendeeData.company}</p>
                </div>
                
                <div className="flex items-center mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-secondary-600">{attendeeData.jobTitle}</p>
                </div>
                
                {attendeeData.country && (
                  <div className="flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-secondary-600">{attendeeData.country}</p>
                  </div>
                )}
                
                <div className="mt-4 pt-3 border-t border-dashed border-secondary-200">
                  <p className="text-sm text-secondary-500 font-medium">Attendee ID</p>
                  <div className="flex items-center">
                    <p className="font-mono text-secondary-700">{attendeeData.attendeeId}</p>
                    <div className="ml-3 bg-accent-50 text-accent-700 px-3 py-1 rounded-full text-sm font-medium">
                      Attendee
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="w-full text-center py-4 border-t border-secondary-100 bg-secondary-50">
            <p className="text-secondary-600 text-sm mb-1">Please present this pass at the entrance for verification</p>
            <a 
              href="https://www.nepdent2025.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800 transition-colors font-medium flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              www.nepdent2025.com
            </a>
          </div>
        </div>
        
        <div className="mt-8 rounded-xl bg-secondary-50 p-6 border border-secondary-100 print:hidden">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Digital Pass Information
          </h3>
          <div className="text-secondary-600 space-y-2 text-sm">
            <p>• Your digital pass can be saved by printing it as a PDF or as a physical copy</p>
            <p>• This pass gives you access to all standard conference areas</p>
            <p>• Remember to bring a valid ID that matches the information on this pass</p>
            <p>• For any issues with your pass, contact support@nepdent2025.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalPassPage;