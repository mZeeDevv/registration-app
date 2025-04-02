import { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import toast from 'react-hot-toast';

const HomePageContentPage = () => {
  const [content, setContent] = useState({
    stats: [
      { value: '', label: '', icon: '🏢' },
      { value: '', label: '', icon: '🌎' },
      { value: '', label: '', icon: '👥' },
      { value: '', label: '', icon: '🎤' }
    ],
    speakers: [
      { name: '', role: '', image: '' },
      { name: '', role: '', image: '' },
      { name: '', role: '', image: '' }
    ],
    testimonials: [
      { text: '', author: '', role: '' },
      { text: '', author: '', role: '' }
    ],
    brands: [
      { name: '', boothNumber: '', image: '' }
    ],
    eventDetails: {
      venue: '',
      hours: '',
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(collection(db, 'content'), 'homepage');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Merge the data with default values to ensure all fields exist
        setContent({
          stats: data.stats || [
            { value: '', label: '', icon: '🏢' },
            { value: '', label: '', icon: '🌎' },
            { value: '', label: '', icon: '👥' },
            { value: '', label: '', icon: '🎤' }
          ],
          speakers: data.speakers || [
            { name: '', role: '', image: '' },
            { name: '', role: '', image: '' },
            { name: '', role: '', image: '' }
          ],
          testimonials: data.testimonials || [
            { text: '', author: '', role: '' },
            { text: '', author: '', role: '' }
          ],
          brands: data.brands || [
            { name: '', boothNumber: '', image: '' }
          ],
          eventDetails: {
            venue: data.eventDetails?.venue || '',
            hours: data.eventDetails?.hours || '',
          }
        });
      }
    } catch (error) {
      toast.error('Error loading content');
      console.error('Error loading content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(collection(db, 'content'), 'homepage');
      await setDoc(docRef, content, { merge: true });
      toast.success('Content saved successfully');
    } catch (error) {
      toast.error('Error saving content');
      console.error('Error saving content:', error);
    }
    setIsSaving(false);
  };

  const updateStats = (index, field, value) => {
    setContent(prev => ({
      ...prev,
      stats: (prev.stats || []).map((stat, i) => 
        i === index ? { ...stat, [field]: value } : stat
      )
    }));
  };

  const updateSpeakers = (index, field, value) => {
    setContent(prev => ({
      ...prev,
      speakers: (prev.speakers || []).map((speaker, i) => 
        i === index ? { ...speaker, [field]: value } : speaker
      )
    }));
  };

  const updateTestimonials = (index, field, value) => {
    setContent(prev => ({
      ...prev,
      testimonials: (prev.testimonials || []).map((testimonial, i) => 
        i === index ? { ...testimonial, [field]: value } : testimonial
      )
    }));
  };

  const updateBrands = (index, field, value) => {
    setContent(prev => ({
      ...prev,
      brands: (prev.brands || []).map((brand, i) => 
        i === index ? { ...brand, [field]: value } : brand
      )
    }));
  };

  const updateEventDetails = (field, value) => {
    setContent(prev => ({
      ...prev,
      eventDetails: { ...(prev.eventDetails || {}), [field]: value }
    }));
  };

  const addNewBrand = () => {
    setContent(prev => ({
      ...prev,
      brands: [
        ...(prev.brands || []),
        { name: '', boothNumber: '', image: '' }
      ]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-secondary-900">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-secondary-900">Homepage Content Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="px-4 sm:px-6 py-2 bg-secondary-600 text-white text-sm sm:text-base rounded-xl hover:bg-secondary-700 transition-colors w-full sm:w-auto"
          >
            {isEditMode ? 'Cancel Edit' : 'Edit Content'}
          </button>
          {isEditMode && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 sm:px-6 py-2 bg-primary-600 text-white text-sm sm:text-base rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(content.stats || []).map((stat, index) => (
            <div key={index} className="space-y-2">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Icon (Emoji)</label>
                <input
                  type="text"
                  value={stat.icon}
                  onChange={(e) => updateStats(index, 'icon', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
                  disabled={!isEditMode}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStats(index, 'label', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
                  disabled={!isEditMode}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Value</label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStats(index, 'value', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
                  disabled={!isEditMode}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Speakers Section */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Featured Speakers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(content.speakers || []).map((speaker, index) => (
            <div key={index} className="space-y-4 p-4 border border-secondary-100 rounded-xl">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Name</label>
                <input
                  type="text"
                  value={speaker.name}
                  onChange={(e) => updateSpeakers(index, 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
                  disabled={!isEditMode}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Role</label>
                <input
                  type="text"
                  value={speaker.role}
                  onChange={(e) => updateSpeakers(index, 'role', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
                  disabled={!isEditMode}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={speaker.image}
                  onChange={(e) => updateSpeakers(index, 'image', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
                  disabled={!isEditMode}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brands Section */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-secondary-900">Featured Brands</h2>
          {isEditMode && (
            <button
              onClick={addNewBrand}
              className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm"
            >
              Add Brand
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(content.brands || []).map((brand, index) => (
            <div key={index} className="space-y-4 p-4 border border-secondary-100 rounded-xl">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brand.name}
                  onChange={(e) => updateBrands(index, 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
                  disabled={!isEditMode}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Booth Number</label>
                <input
                  type="text"
                  value={brand.boothNumber}
                  onChange={(e) => updateBrands(index, 'boothNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
                  disabled={!isEditMode}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={brand.image}
                  onChange={(e) => updateBrands(index, 'image', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
                  placeholder="https://example.com/image.jpg"
                  disabled={!isEditMode}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(content.testimonials || []).map((testimonial, index) => (
            <div key={index} className="space-y-4 p-4 border border-secondary-100 rounded-xl">
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Text</label>
                <textarea
                  value={testimonial.text}
                  onChange={(e) => updateTestimonials(index, 'text', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
                  rows={4}
                  disabled={!isEditMode}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Author</label>
                <input
                  type="text"
                  value={testimonial.author}
                  onChange={(e) => updateTestimonials(index, 'author', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
                  disabled={!isEditMode}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-1">Role</label>
                <input
                  type="text"
                  value={testimonial.role}
                  onChange={(e) => updateTestimonials(index, 'role', e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
                  disabled={!isEditMode}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Section */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Event Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-1">Venue</label>
            <input
              type="text"
              value={content.eventDetails?.venue || ''}
              onChange={(e) => updateEventDetails('venue', e.target.value)}
              className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
              disabled={!isEditMode}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-1">Hours</label>
            <input
              type="text"
              value={content.eventDetails?.hours || ''}
              onChange={(e) => updateEventDetails('hours', e.target.value)}
              className="w-full px-4 py-2 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-300 disabled:bg-secondary-50 disabled:text-secondary-500"
              disabled={!isEditMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageContentPage;