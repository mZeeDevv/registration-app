import { useState } from "react";
import { toast } from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import fullLogo from "../assets/full-logo.png";
import procareLogo from "../assets/procare-logo.png";

const VerifyRegistrationPage = () => {
  const [searchType, setSearchType] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (searchType === "id") {
      const idPattern = /^NEPDENT-\d{5}$/;
      if (!idPattern.test(searchValue)) {
        toast.error("Please enter a valid ID format (NEPDENT-12345)");
        setIsLoading(false);
        return;
      }
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(searchValue)) {
        toast.error("Please enter a valid email address");
        setIsLoading(false);
        return;
      }
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where(searchType === "id" ? "uid" : "email", "==", searchValue)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("No registration found with the provided details");
        setVerifiedData(null);
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const formattedData = {
        id: userData.uid,
        name: userData.fullName,
        email: userData.email,
        mobileNumber: userData.mobileNumber,
        company: userData.company,
        jobTitle: userData.jobTitle,
        country: userData.country,
        registrationDate: userData.createdAt.toDate().toLocaleDateString(),
        interests: userData.interests,
        qrCodeUrl: userData.qrCodeUrl,
      };

      setVerifiedData(formattedData);
      toast.success("Registration verified successfully!");
    } catch (error) {
      console.error("Error verifying registration:", error);
      toast.error("Error verifying registration");
      setVerifiedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Screen version */}
        <div className="bg-white rounded-xl shadow-card p-4 sm:p-6 md:p-8 print:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-secondary-900 mb-4 sm:mb-6">
            Verify Registration
          </h1>

          {!verifiedData ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 print:hidden">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setSearchType("id")}
                    className={`px-3 sm:px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                      searchType === "id"
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-secondary-200 text-secondary-600 hover:bg-secondary-50"
                    }`}
                  >
                    Search by ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType("email")}
                    className={`px-3 sm:px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                      searchType === "email"
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-secondary-200 text-secondary-600 hover:bg-secondary-50"
                    }`}
                  >
                    Search by Email
                  </button>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="searchValue"
                    className="block text-sm font-semibold text-secondary-700"
                  >
                    {searchType === "id" ? "Registration ID" : "Email Address"}
                  </label>
                  <input
                    type={searchType === "id" ? "text" : "email"}
                    id="searchValue"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={
                      searchType === "id" ? "NEPDENT-12345" : "Enter your email"
                    }
                    autoComplete="off"
                    className="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-primary-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Verifying..." : "Verify Registration"}
              </button>
            </form>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-start">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-secondary-900">
                      Registration Details
                    </h2>
                    <dl className="grid grid-cols-1 gap-3 sm:gap-4">
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-secondary-600">
                          Registration ID
                        </dt>
                        <dd className="mt-0.5 sm:mt-1 text-base sm:text-lg text-secondary-900">
                          {verifiedData.id}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-secondary-600">
                          Name
                        </dt>
                        <dd className="mt-0.5 sm:mt-1 text-base sm:text-lg text-secondary-900">
                          {verifiedData.name}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-secondary-600">
                          Mobile Number
                        </dt>
                        <dd className="mt-0.5 sm:mt-1 text-base sm:text-lg text-secondary-900">
                          {verifiedData.mobileNumber}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-secondary-600">
                          Email
                        </dt>
                        <dd className="mt-0.5 sm:mt-1 text-base sm:text-lg text-secondary-900">
                          {verifiedData.email}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-secondary-600">
                          Company
                        </dt>
                        <dd className="mt-0.5 sm:mt-1 text-base sm:text-lg text-secondary-900">
                          {verifiedData.company}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-secondary-600">
                          Job Title
                        </dt>
                        <dd className="mt-0.5 sm:mt-1 text-base sm:text-lg text-secondary-900">
                          {verifiedData.jobTitle}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-secondary-600">
                          Country
                        </dt>
                        <dd className="mt-0.5 sm:mt-1 text-base sm:text-lg text-secondary-900">
                          {verifiedData.country}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-secondary-600">
                          Registration Date
                        </dt>
                        <dd className="mt-0.5 sm:mt-1 text-base sm:text-lg text-secondary-900">
                          {verifiedData.registrationDate}
                        </dd>
                      </div>
                      {verifiedData.interests &&
                        verifiedData.interests.length > 0 && (
                          <div>
                            <dt className="text-xs sm:text-sm font-medium text-secondary-600">
                              Interests
                            </dt>
                            <dd className="mt-2">
                              <div className="flex flex-wrap gap-2">
                                {verifiedData.interests.map((interest, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200"
                                  >
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </dd>
                          </div>
                        )}
                    </dl>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6 text-center">
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-card inline-block">
                    <QRCodeSVG value={verifiedData.qrCodeUrl} size={160} className="sm:size-[200px]" />
                  </div>
                  <div className="text-lg font-semibold text-secondary-900">
                    ID: {verifiedData.id}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handlePrint}
                  className="w-full bg-primary-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg hover:bg-primary-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Print Badge
                </button>
                <button
                  onClick={() => {
                    setVerifiedData(null);
                    setSearchValue("");
                  }}
                  className="w-full border-2 border-primary-600 text-primary-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-primary-50 transition-colors duration-300"
                >
                  Verify Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Print version - Portrait Card */}
        {verifiedData && (
          <div className="hidden print:block w-[54mm] h-[85.6mm] mx-auto bg-white border border-secondary-200 p-4">
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-center items-center mb-4 border-b border-secondary-200 pb-2">
                <img src={fullLogo} className="h-10" alt="NepDent Logo" />
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="flex-shrink-0">
                  <QRCodeSVG value={verifiedData.qrCodeUrl} size={70} />
                </div>

                <div className="text-center">
                  <div className="text-xs text-secondary-500">Attendee</div>
                  <div className="text-sm font-bold text-secondary-900 mb-2">
                    {verifiedData.name}
                  </div>

                  <div className="text-xs text-secondary-500">ID</div>
                  <div className="text-xs font-bold text-secondary-900">
                    {verifiedData.id}
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center border-t border-secondary-200 pt-2">
                <img src={procareLogo} className="h-7" alt="Procare Logo" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyRegistrationPage;
