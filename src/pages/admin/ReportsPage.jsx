import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';


const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    totalRegistrations: 0,
    registrationsByDate: [],
    registrationsByCompany: [],
    registrationsByCountry: [],
    registrationsByInterests: [],
    checkInStats: {
      total: 0,
      checkedIn: 0,
      pending: 0
    },
    printStats: {
      total: 0,
      printed: 0,
      notPrinted: 0
    }
  });

  useEffect(() => {
    setLoading(true);
    // Set up real-time listener
    const usersRef = collection(db, 'users');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const registrations = snapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id,
        uid: doc.data().uid || doc.id
      }));

      const totalRegistrations = registrations.length;

      // Group registrations by date
      const byDate = registrations.reduce((acc, reg) => {
        const date = reg.createdAt?.toDate().toISOString().split('T')[0] || 'Unknown';
        if (!acc[date]) {
          acc[date] = {
            date,
            count: 0,
            registrations: []
          };
        }
        acc[date].count += 1;
        acc[date].registrations.push({
          id: reg.uid,
          company: reg.company || 'Unknown',
          name: reg.fullName || 'Unknown',
          email: reg.email || 'Unknown',
          checkedIn: reg.checkedIn || false,
          cardPrinted: reg.cardPrinted || false,
          country: reg.country || 'Unknown',
          interests: reg.interests || []
        });
        return acc;
      }, {});

      // Convert byDate to array format and sort by date
      const registrationsByDate = Object.values(byDate)
        .sort((a, b) => b.date.localeCompare(a.date));

      // Group by company
      const byCompany = registrations.reduce((acc, reg) => {
        const company = reg.company || 'Unknown';
        acc[company] = (acc[company] || 0) + 1;
        return acc;
      }, {});

      // Group by country
      const byCountry = registrations.reduce((acc, reg) => {
        const country = reg.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {});

      // Group by interests
      const byInterests = registrations.reduce((acc, reg) => {
        const interests = reg.interests || [];
        interests.forEach(interest => {
          acc[interest] = (acc[interest] || 0) + 1;
        });
        return acc;
      }, {});

      // Calculate print status statistics
      const printStats = registrations.reduce((acc, reg) => {
        acc.total++;
        if (reg.cardPrinted) {
          acc.printed++;
        } else {
          acc.notPrinted++;
        }
        return acc;
      }, { total: 0, printed: 0, notPrinted: 0 });

      setReportData({
        totalRegistrations,
        registrationsByDate,
        registrationsByCompany: Object.entries(byCompany).map(([company, count]) => ({
          company,
          count
        })).sort((a, b) => b.count - a.count),
        registrationsByCountry: Object.entries(byCountry).map(([country, count]) => ({
          country,
          count
        })).sort((a, b) => b.count - a.count),
        registrationsByInterests: Object.entries(byInterests).map(([interest, count]) => ({
          interest,
          count
        })).sort((a, b) => b.count - a.count),
        checkInStats: {
          total: totalRegistrations,
          checkedIn: registrations.filter(r => r.checkedIn).length,
          pending: registrations.filter(r => !r.checkedIn).length
        },
        printStats
      });
      setLoading(false);
    }, (error) => {
      console.error('Error in real-time updates:', error);
      toast.error('Failed to get real-time updates');
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array since we want to set up the listener only once

  const handleExportCSV = () => {
    try {
      const headers = ['User ID', 'Name', 'Email', 'Company', 'Country', 'Status', 'Date'];
      const csvData = [
        headers.join(','),
        ...reportData.registrationsByDate.map(reg => 
          [
            reg.id,
            reg.name,
            reg.email,
            reg.company,
            reg.country,
            reg.checkedIn ? 'Checked In' : 'Pending',
            reg.date
          ].join(',')
        )
      ].join('\n');

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'registration_report.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const handleExportExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        reportData.registrationsByDate.map(reg => ({
          'User ID': reg.id,
          'Name': reg.name,
          'Email': reg.email,
          'Company': reg.company,
          'Country': reg.country,
          'Status': reg.checkedIn ? 'Checked In' : 'Pending',
          'Date': reg.date
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
      XLSX.writeFile(workbook, 'registration_report.xlsx');
      toast.success('Excel file exported successfully');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Failed to export Excel file');
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape'
      });
      
      // Add title
      doc.setFontSize(16);
      doc.text('Registration Report', 14, 15);
      
      // Add summary
      doc.setFontSize(12);
      doc.text(`Total Registrations: ${reportData.totalRegistrations}`, 14, 25);
      doc.text(`Checked In: ${reportData.checkInStats.checkedIn}`, 14, 32);
      doc.text(`Pending Check-in: ${reportData.checkInStats.pending}`, 14, 39);
      doc.text(`Cards Printed: ${reportData.printStats.printed}`, 14, 46);
      doc.text(`Cards Pending Print: ${reportData.printStats.notPrinted}`, 14, 53);

      // Add registration table
      autoTable(doc, {
        startY: 60,
        head: [['User ID', 'Name', 'Email', 'Company', 'Country', 'Check-in Status', 'Print Status', 'Date']],
        body: reportData.registrationsByDate.flatMap(dateGroup => 
          dateGroup.registrations.map(reg => [
            reg.id,
            reg.name,
            reg.email,
            reg.company,
            reg.country,
            reg.checkedIn ? 'Checked In' : 'Pending',
            reg.cardPrinted ? 'Printed' : 'Not Printed',
            dateGroup.date
          ])
        ),
      });

      doc.save('registration_report.pdf');
      toast.success('PDF file exported successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF file');
    }
  };

  const handleExportCSVByUser = () => {
    try {
      const headers = ['User ID', 'Name', 'Email', 'Company', 'Country', 'Status', 'Date'];
      const csvData = [
        headers.join(','),
        ...reportData.registrationsByDate.map(reg => 
          [
            reg.id,
            reg.name,
            reg.email,
            reg.company,
            reg.country,
            reg.checkedIn ? 'Checked In' : 'Pending',
            reg.date
          ].join(',')
        )
      ].join('\n');
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'registration_report_by_user.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to export report by user');
    }
  };

  const handleExportCSVByUsersCollection = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      const headers = ['User ID', 'Name', 'Email', 'Company', 'Country', 'Status', 'Date'];
      const csvData = [
        headers.join(','),
        ...snapshot.docs.map(doc => {
          const data = doc.data();
          return [
            doc.id,
            data.name || 'Unknown',
            data.email || 'Unknown',
            data.company || 'Unknown',
            data.country || 'Unknown',
            data.checkedIn ? 'Checked In' : 'Pending',
            data.createdAt?.toDate().toLocaleDateString() || 'Unknown'
          ].join(',');
        })
      ].join('\n');

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'users_collection_report.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting users collection:', error);
      toast.error('Failed to export users collection');
    }
  };

  const handleExportExcelByUsersCollection = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      const data = snapshot.docs.map(doc => {
        const userData = doc.data();
        return {
          'User ID': doc.id,
          'Name': userData.name || 'Unknown',
          'Email': userData.email || 'Unknown',
          'Company': userData.company || 'Unknown',
          'Country': userData.country || 'Unknown',
          'Status': userData.checkedIn ? 'Checked In' : 'Pending',
          'Date': userData.createdAt?.toDate().toLocaleDateString() || 'Unknown'
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
      XLSX.writeFile(workbook, 'users_collection_report.xlsx');
      toast.success('Excel file exported successfully');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Failed to export Excel file');
    }
  };

  const handleExportPDFByUsersCollection = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      const doc = new jsPDF({
        orientation: 'landscape'
      });
      doc.setFontSize(16);
      doc.text('Users Collection Report', 14, 15);

      const data = snapshot.docs.map(doc => {
        const userData = doc.data();
        return [
          doc.id,
          userData.name || 'Unknown',
          userData.email || 'Unknown',
          userData.company || 'Unknown',
          userData.country || 'Unknown',
          userData.checkedIn ? 'Checked In' : 'Pending',
          userData.createdAt?.toDate().toLocaleDateString() || 'Unknown'
        ];
      });

      autoTable(doc, {
        startY: 25,
        head: [['User ID', 'Name', 'Email', 'Company', 'Country', 'Status', 'Date']],
        body: data
      });

      doc.save('users_collection_report.pdf');
      toast.success('PDF file exported successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF file');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold font-display text-secondary-900">Reports</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportExcel}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="w-full sm:w-auto px-6 py-2.5 bg-accent-600 text-white rounded-xl hover:bg-accent-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            Export to CSV
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Registrations Card */}
        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between">
            <div className="bg-primary-50 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-secondary-900">
              {loading ? '...' : reportData.totalRegistrations}
            </span>
          </div>
          <h3 className="mt-4 text-secondary-600 font-medium">Total Registrations</h3>
        </div>

        {/* Check-in Stats Card */}
        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between">
            <div className="bg-accent-50 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-secondary-900">
              {loading ? '...' : reportData.checkInStats.checkedIn}
            </span>
          </div>
          <h3 className="mt-4 text-secondary-600 font-medium">Checked In</h3>
        </div>

        {/* Pending Check-ins Card */}
        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between">
            <div className="bg-secondary-50 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-secondary-900">
              {loading ? '...' : reportData.checkInStats.pending}
            </span>
          </div>
          <h3 className="mt-4 text-secondary-600 font-medium">Pending Check-ins</h3>
        </div>

        {/* Print Status Card */}
        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between">
            <div className="bg-primary-50 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-secondary-900">
              {loading ? '...' : reportData.printStats.printed}
            </span>
          </div>
          <h3 className="mt-4 text-secondary-600 font-medium">Cards Printed</h3>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between">
            <div className="bg-secondary-50 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-secondary-900">
              {loading ? '...' : reportData.printStats.notPrinted}
            </span>
          </div>
          <h3 className="mt-4 text-secondary-600 font-medium">Cards Pending Print</h3>
        </div>
      </div>

      {/* Registration Trends */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <h2 className="text-xl font-bold text-secondary-900 mb-6">Registration Trends</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-secondary-200">
                <th className="pb-3 text-sm font-semibold text-secondary-600">Date</th>
                <th className="pb-3 text-sm font-semibold text-secondary-600">Registrations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {loading ? (
                <tr>
                  <td colSpan="2" className="py-4 text-center text-secondary-600">Loading...</td>
                </tr>
              ) : (
                reportData.registrationsByDate.map((reg) => (
                  <tr key={reg.date} className="hover:bg-secondary-50">
                    <td className="py-3 text-secondary-900">{reg.date}</td>
                    <td className="py-3 text-secondary-600">{reg.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Companies Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <h2 className="text-xl font-bold text-secondary-900 mb-6">Companies Distribution</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-secondary-200">
                <th className="pb-3 text-sm font-semibold text-secondary-600">Company</th>
                <th className="pb-3 text-sm font-semibold text-secondary-600">Registrations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {loading ? (
                <tr>
                  <td colSpan="2" className="py-4 text-center text-secondary-600">Loading...</td>
                </tr>
              ) : (
                reportData.registrationsByCompany.map(({ company, count }) => (
                  <tr key={company} className="hover:bg-secondary-50">
                    <td className="py-3 text-secondary-900">{company}</td>
                    <td className="py-3 text-secondary-600">{count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Countries Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <h2 className="text-xl font-bold text-secondary-900 mb-6">Countries Distribution</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-secondary-200">
                <th className="pb-3 text-sm font-semibold text-secondary-600">Country</th>
                <th className="pb-3 text-sm font-semibold text-secondary-600">Registrations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {loading ? (
                <tr>
                  <td colSpan="2" className="py-4 text-center text-secondary-600">Loading...</td>
                </tr>
              ) : (
                reportData.registrationsByCountry.map(({ country, count }) => (
                  <tr key={country} className="hover:bg-secondary-50">
                    <td className="py-3 text-secondary-900">{country}</td>
                    <td className="py-3 text-secondary-600">{count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interests Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <h2 className="text-xl font-bold text-secondary-900 mb-6">Interests Distribution</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-secondary-200">
                <th className="pb-3 text-sm font-semibold text-secondary-600">Interest</th>
                <th className="pb-3 text-sm font-semibold text-secondary-600">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {loading ? (
                <tr>
                  <td colSpan="2" className="py-4 text-center text-secondary-600">Loading...</td>
                </tr>
              ) : (
                reportData.registrationsByInterests.map(({ interest, count }) => (
                  <tr key={interest} className="hover:bg-secondary-50">
                    <td className="py-3 text-secondary-900">{interest}</td>
                    <td className="py-3 text-secondary-600">{count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;