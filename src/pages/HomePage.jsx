import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import CountdownTimer from '../components/CountdownTimer';
import dummy from '../assets/dummy.png';
const HomePage = () => {  
  const [content, setContent] = useState({
    stats: [
      { value: '500+', label: 'Expected Exhibitors', icon: '🏢' },
      { value: '50+', label: 'Countries', icon: '🌎' },
      { value: '25K+', label: 'Expected Attendees', icon: '👥' },
      { value: '100+', label: 'Renowned Speakers', icon: '🎤' }
    ],
    speakers: [],
    testimonials: [],
    brands: [],
    eventDetails: {
      venue: 'Kathmandu Exhibition Center, Nepal',
      hours: '9:00 AM - 6:00 PM Daily',
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const docRef = doc(collection(db, 'content'), 'homepage');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setContent(prevContent => ({
          ...prevContent,
          ...data
        }));
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-100">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 md:w-64 md:h-64 bg-accent-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-40 left-10 w-36 h-36 md:w-72 md:h-72 bg-primary-200 rounded-full blur-3xl opacity-30"></div>
      
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 pt-8 md:pt-16 pb-6 md:pb-12 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-8">
            <div>
              <span className="inline-block px-2 py-1 text-xs md:text-sm font-semibold text-accent-700 bg-accent-50 rounded-full shadow-sm">
                April 18-20, 2025 • Location Here
              </span>
              <h1 className="mt-3 md:mt-4 text-3xl md:text-5xl font-display font-bold tracking-tight text-secondary-900 sm:text-6xl">
                <span className="block text-primary-600">Event Name Here</span>
                <span className="block">Show 2025</span>
              </h1>
              <p className="mt-3 md:mt-4 text-base md:text-xl text-secondary-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, rem distinctio! Perspiciatis ab, minus accusamus facere reiciendis error aperiam omnis ad sint neque numquam autem at cupiditate illo velit voluptatibus?
            </p>
            
            </div>
            
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link to="/register" className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg font-medium rounded-xl bg-primary-600 text-white shadow-lg hover:bg-primary-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Register Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="relative mt-6 md:mt-0">
            <div className="absolute inset-0 bg-accent-100 transform rotate-3 rounded-2xl"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img 
                src={dummy}
                alt="Dental Exhibition" 
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Countdown Timer */}
      <CountdownTimer />
      
      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {content.stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 md:p-6 rounded-xl shadow-card hover:shadow-xl transition-shadow duration-300 border border-secondary-100 transform hover:-translate-y-1">
              <div className="text-2xl md:text-4xl mb-2 md:mb-3">{stat.icon}</div>
              <div className="text-xl md:text-3xl font-bold text-primary-700">{stat.value}</div>
              <div className="text-sm md:text-base text-secondary-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Brands Section */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-3 md:mb-4 font-display">Featured Exhibitors</h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-secondary-600">Meet our esteemed exhibitors at DTS Nepal 2025</p>
        </div>
        
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading skeletons for brands
            [...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-card animate-pulse border border-secondary-100">
                <div className="aspect-w-16 aspect-h-9">
                  <div className="w-full h-48 bg-secondary-200"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-secondary-200 rounded w-1/3"></div>
                    <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : content.brands.length > 0 ? (
            content.brands.map((brand, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-card group hover:shadow-xl transition-all duration-300 border border-secondary-100">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={brand.image} 
                    alt={brand.name}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg md:text-xl font-bold text-secondary-900">{brand.name}</h3>
                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-lg font-semibold text-sm">
                      Booth #{brand.boothNumber}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-secondary-600">Exhibitor list will be announced soon.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Speakers Section */}
      <div className="bg-secondary-50 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-3 md:mb-4 font-display">Featured Speakers</h2>
            <p className="max-w-2xl mx-auto text-sm md:text-base text-secondary-600">Learn from the brightest minds in dentistry</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {isLoading ? (
              // Loading skeletons
              [...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-card animate-pulse">
                  <div className="relative h-56 md:h-64 bg-secondary-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : content.speakers.length > 0 ? (
              content.speakers.map((speaker, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-56 md:h-64 overflow-hidden">
                    <img 
                      src={speaker.image} 
                      alt={speaker.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 to-transparent opacity-60"></div>
                    <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 text-white">
                      <h3 className="font-bold text-lg md:text-xl">{speaker.name}</h3>
                      <p className="text-sm md:text-base">{speaker.role}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-secondary-600">Speakers will be announced soon.</p>
              </div>
            )}
          </div>
          
          {content.speakers.length > 0 && (
            <div className="text-center mt-8 md:mt-10">
              <Link to="/speakers" className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 text-sm md:text-base border border-secondary-300 rounded-xl text-secondary-700 hover:bg-secondary-100 transition-colors">
                View All Speakers
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-3 md:mb-4 font-display">Industry Excitement</h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-secondary-600">Hear what dental professionals are saying about the first-ever DTS in Nepal</p>
        </div>
        
        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          {isLoading ? (
            // Loading skeletons for testimonials
            [...Array(2)].map((_, index) => (
              <div key={index} className="bg-white p-5 md:p-8 rounded-xl shadow-card border border-secondary-100 relative animate-pulse">
                <div className="absolute top-3 md:top-4 left-3 md:left-4 text-4xl md:text-5xl text-primary-200">"</div>
                <div className="relative z-10 pt-4 md:pt-0">
                  <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded w-2/3 mb-6"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-secondary-200 rounded w-1/3"></div>
                    <div className="h-3 bg-secondary-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : content.testimonials.length > 0 ? (
            content.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-5 md:p-8 rounded-xl shadow-card border border-secondary-100 relative">
                <div className="absolute top-3 md:top-4 left-3 md:left-4 text-4xl md:text-5xl text-primary-200">"</div>
                <div className="relative z-10 pt-4 md:pt-0">
                  <p className="text-base md:text-lg text-secondary-700 mb-4 md:mb-6">{testimonial.text}</p>
                  <div>
                    <p className="font-bold text-secondary-900">{testimonial.author}</p>
                    <p className="text-sm md:text-base text-secondary-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-secondary-600">Testimonials will be added soon.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-10 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 font-display">Be Part of Dental History in Nepal</h2>
          <p className="text-base md:text-xl text-primary-100 mb-6 md:mb-8">April 18-20, 2025 • Kathmandu, Nepal</p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-medium rounded-xl bg-white text-primary-700 shadow-lg hover:bg-primary-50 transition-colors">
              Register Now
            </Link>
          </div>
        </div>
      </div>
      
      {/* Event Details with Map */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4 md:mb-6 font-display">Event Details</h2>
            <dl className="space-y-3 md:space-y-4">
              <div className="flex gap-3 md:gap-4 items-start">
                <div className="bg-primary-100 p-2 md:p-3 rounded-lg text-primary-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <dt className="font-semibold text-secondary-900">Date</dt>
                  <dd className="text-sm md:text-base text-secondary-600">Dates here</dd>
                </div>
              </div>
              
              <div className="flex gap-3 md:gap-4 items-start">
                <div className="bg-primary-100 p-2 md:p-3 rounded-lg text-primary-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <dt className="font-semibold text-secondary-900">Venue</dt>
                  <dd className="text-sm md:text-base text-secondary-600">Venue Details</dd>
                </div>
              </div>
              
              <div className="flex gap-3 md:gap-4 items-start">
                <div className="bg-primary-100 p-2 md:p-3 rounded-lg text-primary-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <dt className="font-semibold text-secondary-900">Hours</dt>
                  <dd className="text-sm md:text-base text-secondary-600">Time here</dd>
                </div>
              </div>
            </dl>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-lg border border-secondary-200 h-60 md:h-80">
            <div className="w-full h-full bg-center bg-cover" style={{backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=Kathmandu,Nepal&zoom=14&size=600x400&markers=Kathmandu,Nepal&key=YOUR_API_KEY')"}}>
              <div className="w-full h-full flex items-center justify-center bg-secondary-200">
                <span className="text-secondary-600 text-sm md:text-base">Event Location Map</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;