'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../../lib/firebase-client';
import { useRouter } from 'next/navigation';

interface CoachProfile {
  userId: string;
  displayName: string;
  bio: string;
  sports: string[];
  experience: number;
  certifications: string[];
  hourlyRate: number;
  location: string;
  availability: string[];
  specialties: string[];
  languages: string[];
  profileImage?: string;
  phoneNumber?: string;
  website?: string;
  email?: string;
  emailVerified?: boolean;
  isPublic?: boolean;
  socialMedia: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

const availableSports = [
  'Basketball', 'Football', 'Soccer', 'Tennis', 'Baseball', 'Volleyball',
  'Swimming', 'Track & Field', 'Golf', 'Wrestling', 'Boxing', 'MMA',
  'Fitness Training', 'Yoga', 'Pilates', 'CrossFit', 'Personal Training'
];

const availabilityOptions = [
  'Monday Morning', 'Monday Afternoon', 'Monday Evening',
  'Tuesday Morning', 'Tuesday Afternoon', 'Tuesday Evening',
  'Wednesday Morning', 'Wednesday Afternoon', 'Wednesday Evening',
  'Thursday Morning', 'Thursday Afternoon', 'Thursday Evening',
  'Friday Morning', 'Friday Afternoon', 'Friday Evening',
  'Saturday Morning', 'Saturday Afternoon', 'Saturday Evening',
  'Sunday Morning', 'Sunday Afternoon', 'Sunday Evening'
];

export default function EditCoachProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CoachProfile>({
    userId: '',
    displayName: '',
    bio: '',
    sports: [],
    experience: 0,
    certifications: [],
    hourlyRate: 0,
    location: '',
    availability: [],
    specialties: [],
    languages: ['English'],
    socialMedia: {}
  });
  const [newCertification, setNewCertification] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const router = useRouter();

  const loadCoachProfile = useCallback(async (userId: string) => {
    try {
      const coachRef = doc(db, 'coaches', userId);
      const coachSnap = await getDoc(coachRef);
      
      if (coachSnap.exists()) {
        const data = coachSnap.data() as CoachProfile;
        setFormData({
          ...data,
          socialMedia: data.socialMedia || {}
        });
      } else {
        // Initialize with user data if coach profile doesn't exist
        setFormData(prev => ({
          ...prev,
          userId: userId,
          displayName: user?.displayName || '',
        }));
      }
    } catch (error) {
      console.error('Error loading coach profile:', error);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await loadCoachProfile(user.uid);
      } else {
        router.push('/signin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, loadCoachProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('socialMedia.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value
        }
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSportToggle = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const handleAvailabilityToggle = (slot: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter(s => s !== slot)
        : [...prev.availability, slot]
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certification: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== certification)
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const coachRef = doc(db, 'coaches', user.uid);
      await setDoc(coachRef, {
        ...formData,
        userId: user.uid,
        updatedAt: new Date(),
        // Set initial rating data if not exists
        averageRating: 0,
        totalReviews: 0,
        isVerified: false
      }, { merge: true });

      router.push('/dashboard/coach');
    } catch (error) {
      console.error('Error saving coach profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Coach Profile</h1>
        <p className="mt-2 text-gray-600">
          Complete your profile to attract more students and showcase your expertise.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell students about your coaching philosophy, background, and what makes you unique..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Sports & Specialties */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sports & Specialties</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sports You Coach
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableSports.map(sport => (
                <label key={sport} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sports.includes(sport)}
                    onChange={() => handleSportToggle(sport)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{sport}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialties
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.specialties.map(specialty => (
                <span
                  key={specialty}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {specialty}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(specialty)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Add a specialty..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addSpecialty}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Certifications</h2>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.certifications.map(cert => (
              <span
                key={cert}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {cert}
                <button
                  type="button"
                  onClick={() => removeCertification(cert)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="Add a certification..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addCertification}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Availability</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {availabilityOptions.map(slot => (
              <label key={slot} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.availability.includes(slot)}
                  onChange={() => handleAvailabilityToggle(slot)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{slot}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact & Social Media */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact & Social Media</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="text"
                name="socialMedia.instagram"
                value={formData.socialMedia.instagram || ''}
                onChange={handleInputChange}
                placeholder="@username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="text"
                name="socialMedia.twitter"
                value={formData.socialMedia.twitter || ''}
                onChange={handleInputChange}
                placeholder="@username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>



        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
} 