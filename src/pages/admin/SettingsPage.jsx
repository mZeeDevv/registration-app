import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [registrationsEnabled, setRegistrationsEnabled] = useState(true);
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const interestsDoc = await getDoc(doc(db, "settings", "interests"));
      const generalSettingsDoc = await getDoc(doc(db, "settings", "general"));
      
      if (interestsDoc.exists()) {
        setInterests(interestsDoc.data().list || []);
      }
      
      if (generalSettingsDoc.exists()) {
        setRegistrationsEnabled(generalSettingsDoc.data().registrationsEnabled ?? true);
        setEmailNotifications(generalSettingsDoc.data().emailNotifications ?? true);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load settings");
    }
  };

  const handleAddInterest = async () => {
    if (!newInterest.trim()) return;

    try {
      const updatedInterests = [...interests, newInterest.trim()];
      await setDoc(doc(db, "settings", "interests"), {
        list: updatedInterests,
      });
      setInterests(updatedInterests);
      setNewInterest("");
      toast.success("Interest added successfully");
    } catch (error) {
      console.error("Error adding interest:", error);
      toast.error("Failed to add interest");
    }
  };

  const handleRemoveInterest = async (interestToRemove) => {
    try {
      const updatedInterests = interests.filter(
        (interest) => interest !== interestToRemove
      );
      await setDoc(doc(db, "settings", "interests"), {
        list: updatedInterests,
      });
      setInterests(updatedInterests);
      toast.success("Interest removed successfully");
    } catch (error) {
      console.error("Error removing interest:", error);
      toast.error("Failed to remove interest");
    }
  };

  const toggleEmailNotifications = async () => {
    try {
      const newValue = !emailNotifications;
      await setDoc(doc(db, "settings", "general"), {
        emailNotifications: newValue,
        registrationsEnabled
      }, { merge: true });
      setEmailNotifications(newValue);
      toast.success("Email notifications setting updated");
    } catch (error) {
      console.error("Error updating email notifications:", error);
      toast.error("Failed to update email notifications setting");
    }
  };

  const toggleRegistrations = async () => {
    try {
      const newValue = !registrationsEnabled;
      await setDoc(doc(db, "settings", "general"), {
        registrationsEnabled: newValue,
        emailNotifications
      }, { merge: true });
      setRegistrationsEnabled(newValue);
      toast.success("Registration setting updated");
    } catch (error) {
      console.error("Error updating registration setting:", error);
      toast.error("Failed to update registration setting");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display text-secondary-900">
          Settings
        </h1>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Content Management */}
        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-start mb-4">
            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-secondary-900">
                Content Management
              </h2>
              <p className="text-secondary-600 text-sm mt-1">
                Manage website content and information
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <Link
              to="/admin/homepage-content"
              className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <span className="text-secondary-900">Homepage Content</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-secondary-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white p-6 rounded-xl shadow-card">
          <div className="flex items-start mb-4">
            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-secondary-900">
                General Settings
              </h2>
              <p className="text-secondary-600 text-sm mt-1">
                Configure application settings
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-secondary-900">
                  Email Notifications
                </label>
                <span className="text-sm text-secondary-600">
                  Receive email alerts for new registrations
                </span>
              </div>
              <button
                onClick={toggleEmailNotifications}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
                  emailNotifications ? "bg-primary-600" : "bg-secondary-200"
                }`}
              >
                <span
                  className={`${
                    emailNotifications ? "translate-x-5" : "translate-x-0"
                  } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
                ></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-secondary-900">
                  Enable Registrations
                </label>
                <span className="text-sm text-secondary-600">
                  Allow users to register for the event
                </span>
              </div>
              <button
                onClick={toggleRegistrations}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
                  registrationsEnabled ? "bg-primary-600" : "bg-secondary-200"
                }`}
              >
                <span
                  className={`${
                    registrationsEnabled ? "translate-x-5" : "translate-x-0"
                  } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
              ></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Areas of Interest Management */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <div className="flex items-start mb-4">
          <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              Areas of Interest
            </h2>
            <p className="text-secondary-600 text-sm mt-1">
              Manage available areas of interest for registration
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Add new interest */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Enter new area of interest"
              className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button
              onClick={handleAddInterest}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add
            </button>
          </div>

          {/* List of interests */}
          <div className="mt-4 space-y-2">
            {interests.map((interest) => (
              <div
                key={interest}
                className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
              >
                <span className="text-secondary-900">{interest}</span>
                <button
                  onClick={() => handleRemoveInterest(interest)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
