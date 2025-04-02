import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { formatDistanceToNow, format } from "date-fns";

// Details Modal Component
const DetailsModal = ({ isOpen, onClose, registration }) => {
  if (!isOpen || !registration) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-secondary-900/75 transition-opacity"></div>
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="relative transform overflow-hidden bg-white text-left shadow-xl transition-all w-full sm:rounded-xl sm:max-w-lg sm:my-8">
          <div className="bg-white px-4 sm:px-6 pt-5 pb-4 sm:p-6">
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold leading-6 text-secondary-900">
                Registration Details
              </h3>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-secondary-400 hover:text-secondary-500 active:bg-secondary-50"
                aria-label="Close details"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-secondary-500">
                  ID
                </label>
                <div className="mt-1 text-sm sm:text-base text-secondary-900 font-mono">
                  {registration.id}
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-secondary-500">
                  Name
                </label>
                <div className="mt-1 text-sm sm:text-base text-secondary-900">
                  {registration.name}
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-secondary-500">
                  Email
                </label>
                <div className="mt-1 text-sm sm:text-base text-secondary-900 break-all">
                  {registration.email}
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-secondary-500">
                  Company
                </label>
                <div className="mt-1 text-sm sm:text-base text-secondary-900">
                  {registration.company}
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-secondary-500">
                  Registration Date
                </label>
                <div className="mt-1 text-sm sm:text-base text-secondary-900">
                  {format(registration.createdAt, "PPP p")}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-secondary-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-secondary-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm font-medium rounded-xl border border-secondary-300 bg-white text-secondary-700 shadow-sm hover:bg-secondary-50 transition-colors duration-300 active:bg-secondary-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    checkedInCount: 0,
    pendingCount: 0,
  });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Set up real-time listener
    const usersRef = collection(db, 'users');
    const recentRegistrationsQuery = query(
      usersRef,
      orderBy('createdAt', 'desc'),
      limit(4)
    );

    const unsubscribe = onSnapshot(recentRegistrationsQuery, (snapshot) => {
      const registrations = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate();
        return {
          id: data.uid,
          name: `${data.fullName}`,
          email: data.email,
          time: formatDistanceToNow(createdAt, {
            addSuffix: true,
          }),
          status: "approved",
          company: data.company,
          createdAt: createdAt,
          checkedIn: data.checkedIn || false,
        };
      });

      setRecentRegistrations(registrations);

      // Calculate stats from the total collection
      const totalRegistrations = snapshot.size;
      const checkedInCount = registrations.filter(reg => reg.checkedIn).length;
      const pendingCount = totalRegistrations - checkedInCount;

      setStats({
        totalRegistrations,
        checkedInCount,
        pendingCount,
      });
      setLoading(false);
    }, (error) => {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array since we want to set up the listener only once

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
  };

  // Loading skeleton for the table
  const TableSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-6 bg-secondary-100 rounded w-full mb-4"></div>
      {[1, 2, 3, 4].map(item => (
        <div key={item} className="space-y-3 mb-4">
          <div className="h-4 bg-secondary-100 rounded w-full"></div>
          <div className="h-4 bg-secondary-100 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-mobile-section md:space-y-tablet-section">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-h2 md:text-h1 font-bold font-display text-secondary-900">
          Dashboard Overview
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-mobile-gap md:gap-tablet-gap">
        <div className="bg-white p-mobile-section md:p-tablet-section rounded-xl shadow-card hover:shadow-xl transition-all duration-300 border border-secondary-100">
          <div className="flex items-center justify-between">
            <div className="bg-primary-50 p-2 sm:p-3 rounded-xl">
              <div className="text-primary-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-secondary-900">
              {loading ? (
                <div className="h-8 w-12 bg-secondary-100 animate-pulse rounded"></div>
              ) : (
                stats.totalRegistrations
              )}
            </span>
          </div>
          <h3 className="mt-3 md:mt-4 text-sm md:text-base text-secondary-600 font-medium">
            Total Registrations
          </h3>
        </div>

        <div className="bg-white p-mobile-section md:p-tablet-section rounded-xl shadow-card hover:shadow-xl transition-all duration-300 border border-secondary-100">
          <div className="flex items-center justify-between">
            <div className="bg-accent-50 p-2 sm:p-3 rounded-xl">
              <div className="text-accent-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-secondary-900">
              {loading ? (
                <div className="h-8 w-12 bg-secondary-100 animate-pulse rounded"></div>
              ) : (
                stats.checkedInCount
              )}
            </span>
          </div>
          <h3 className="mt-3 md:mt-4 text-sm md:text-base text-secondary-600 font-medium">
            Checked In
          </h3>
        </div>

        <div className="bg-white p-mobile-section md:p-tablet-section rounded-xl shadow-card hover:shadow-xl transition-all duration-300 border border-secondary-100">
          <div className="flex items-center justify-between">
            <div className="bg-secondary-50 p-2 sm:p-3 rounded-xl">
              <div className="text-secondary-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-secondary-900">
              {loading ? (
                <div className="h-8 w-12 bg-secondary-100 animate-pulse rounded"></div>
              ) : (
                stats.pendingCount
              )}
            </span>
          </div>
          <h3 className="mt-3 md:mt-4 text-sm md:text-base text-secondary-600 font-medium">
            Pending Check-ins
          </h3>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-xl shadow-card p-mobile-section md:p-tablet-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-mobile-gap md:mb-tablet-gap">
          <h2 className="text-h3 md:text-h2 font-bold text-secondary-900">
            Recent Registrations
          </h2>
          <button 
            onClick={() => navigate('/admin/registrations')}
            className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
            View All
          </button>
        </div>
        <div className="overflow-x-auto -mx-mobile-section md:-mx-tablet-section">
          <div className="min-w-[800px] px-mobile-section md:px-tablet-section">
            {loading ? (
              <TableSkeleton />
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-secondary-200">
                    <th className="pb-3 text-sm md:text-base text-secondary-600 font-semibold">Name</th>
                    <th className="pb-3 text-sm md:text-base text-secondary-600 font-semibold">
                      Company
                    </th>
                    <th className="pb-3 text-sm md:text-base text-secondary-600 font-semibold">Email</th>
                    <th className="pb-3 text-sm md:text-base text-secondary-600 font-semibold">Time</th>
                    <th className="pb-3 text-sm md:text-base text-secondary-600 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {recentRegistrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-secondary-50">
                      <td className="py-3 md:py-4 text-sm md:text-base text-secondary-900">
                        {registration.name}
                      </td>
                      <td className="py-3 md:py-4 text-sm md:text-base text-secondary-600">
                        {registration.company}
                      </td>
                      <td className="py-3 md:py-4 text-sm md:text-base text-secondary-600">
                        {registration.email}
                      </td>
                      <td className="py-3 md:py-4 text-sm md:text-base text-secondary-600">
                        {registration.time}
                      </td>
                      <td className="py-3 md:py-4">
                        <button 
                          onClick={() => handleViewDetails(registration)}
                          className="text-sm md:text-base text-primary-600 hover:text-primary-700 font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <DetailsModal
        isOpen={selectedRegistration !== null}
        onClose={() => setSelectedRegistration(null)}
        registration={selectedRegistration}
      />
    </div>
  );
};

export default DashboardPage;
