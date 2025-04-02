import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const CheckInPage = () => {
  const { id } = useParams();
  const [attendee, setAttendee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInStatus, setCheckInStatus] = useState({
    isCheckedIn: false,
    isUpdating: false,
    error: null
  });

  useEffect(() => {
    async function fetchAttendee() {
      try {
        setLoading(true);
        
        // Fetch attendee data using document ID from the URL
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const attendeeData = { id: docSnap.id, ...docSnap.data() };
          setAttendee(attendeeData);
          
          // Check if the attendee has already been checked in
          if (!attendeeData.checkedIn) {
            // Update check-in status
            await updateAttendeeCheckInStatus(docRef, attendeeData);
          } else {
            setCheckInStatus({
              isCheckedIn: true,
              isUpdating: false,
              error: null,
              checkInTime: attendeeData.checkInTime?.toDate()
            });
          }
        } else {
          setError('No registration found with this ID');
        }
      } catch (err) {
        console.error('Error fetching attendee:', err);
        setError('Failed to verify registration. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchAttendee();
    }
  }, [id]);

  async function updateAttendeeCheckInStatus(docRef, attendeeData) {
    try {
      setCheckInStatus(prev => ({ ...prev, isUpdating: true }));
      
      // Update Firestore document to mark the attendee as checked in
      await updateDoc(docRef, {
        checkedIn: true,
        checkInTime: serverTimestamp()
      });
      
      // Update local state
      setAttendee(prev => ({
        ...prev,
        checkedIn: true,
        checkInTime: new Date()
      }));
      
      setCheckInStatus({
        isCheckedIn: true,
        isUpdating: false,
        error: null,
        checkInTime: new Date()
      });
      
      console.log('Attendee successfully marked as checked in');
    } catch (err) {
      console.error('Error updating check-in status:', err);
      setCheckInStatus(prev => ({
        ...prev,
        isUpdating: false,
        error: 'Failed to update check-in status'
      }));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-700 text-lg">Verifying registration...</p>
        </div>
      </div>
    );
  }

  if (error || !attendee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Verification Failed</h2>
          <p className="text-secondary-600 mb-6">{error || 'Unable to verify registration'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-card border border-secondary-100 p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-secondary-900 mb-2">
              Attendee Verified
            </h1>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg inline-block font-semibold text-xl">
                USER REGISTERED
              </div>
              
              {checkInStatus.isCheckedIn && (
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg inline-block font-semibold">
                  {checkInStatus.isUpdating ? 'CHECKING IN...' : 'CHECKED IN'} 
                  {checkInStatus.checkInTime && (
                    <span className="block text-sm font-normal mt-1">
                      {checkInStatus.checkInTime.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                </div>
              )}
              
              {checkInStatus.error && (
                <div className="bg-red-50 text-red-800 px-4 py-2 rounded-lg inline-block mt-1">
                  {checkInStatus.error}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-secondary-50 p-6 rounded-xl mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500">Attendee ID</p>
                <p className="font-medium text-secondary-900">{attendee.uid}</p>
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">Registration Date</p>
                <p className="font-medium text-secondary-900">
                  {attendee.createdAt?.toDate().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">Name</p>
                <p className="font-medium text-secondary-900">{attendee.firstName} {attendee.lastName}</p>
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">Email</p>
                <p className="font-medium text-secondary-900">{attendee.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">Company</p>
                <p className="font-medium text-secondary-900">{attendee.company}</p>
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">Job Title</p>
                <p className="font-medium text-secondary-900">{attendee.jobTitle}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm text-secondary-500">Country</p>
                <p className="font-medium text-secondary-900">{attendee.country}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-secondary-800 mb-2">Areas of Interest</h3>
            <div className="flex flex-wrap gap-2">
              {attendee.interests.map((interest) => (
                <span key={interest} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => window.print()} 
              className="bg-secondary-100 text-secondary-800 px-6 py-3 rounded-xl font-medium hover:bg-secondary-200 transition-colors"
            >
              Print Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
