'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CoachFormData {
  displayName: string;
  email: string;
  username: string;
  bio: string;
  sports: string[];
  experience: number;
  certifications: string[];
  hourlyRate: number;
  location: string;
  specialties: string[];
  languages: string[];
  phoneNumber: string;
  website: string;
  socialMedia: {
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

interface Tag {
  id: string;
  name: string;
  category: string;
}

export default function CoachOnboarding() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [formData, setFormData] = useState<CoachFormData>({
    displayName: '',
    email: '',
    username: '',
    bio: '',
    sports: [],
    experience: 0,
    certifications: [],
    hourlyRate: 0,
    location: '',
    specialties: [],
    languages: ['English'],
    phoneNumber: '',
    website: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  });

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        await checkAdminAccess(user);
      } else {
        router.push('/signin');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const checkAdminAccess = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role !== 'admin') {
          router.push('/dashboard');
          return;
        }
        setUserRole(userData.role);
        await fetchTags();
      } else {
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const tagsRef = collection(db, 'tags');
      const tagsSnapshot = await getDocs(tagsRef);
      const tags: Tag[] = [];
      tagsSnapshot.forEach((doc) => {
        tags.push({ id: doc.id, ...doc.data() } as Tag);
      });
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CoachFormData] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field: 'sports' | 'certifications' | 'specialties' | 'languages', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      if (field === 'sports') {
        return { ...prev, sports: newArray };
      } else if (field === 'certifications') {
        return { ...prev, certifications: newArray };
      } else if (field === 'specialties') {
        return { ...prev, specialties: newArray };
      } else if (field === 'languages') {
        return { ...prev, languages: newArray };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      // Generate a unique ID for the coach
      const coachId = `coach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create coach profile
      const coachRef = doc(db, 'coaches', coachId);
      await setDoc(coachRef, {
        userId: coachId, // Using the generated ID as userId since there's no Firebase Auth user
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email,
        bio: formData.bio,
        sports: formData.sports,
        experience: formData.experience,
        certifications: formData.certifications,
        hourlyRate: formData.hourlyRate,
        location: formData.location,
        availability: [],
        specialties: formData.specialties,
        languages: formData.languages,
        averageRating: 0,
        totalReviews: 0,
        isVerified: false, // Admin can verify later
        profileImage: '',
        phoneNumber: formData.phoneNumber,
        website: formData.website,
        socialMedia: formData.socialMedia,
        createdAt: new Date(),
        updatedAt: new Date(),
        profileCompleted: true,
        adminCreated: true,
        createdBy: user.uid
      });

      // Create a corresponding user document (for consistency)
      const userRef = doc(db, 'users', coachId);
      await setDoc(userRef, {
        userId: coachId,
        username: formData.username,
        email: formData.email,
        displayName: formData.displayName,
        createdAt: new Date(),
        role: 'coach',
        onboardingCompleted: true,
        isVerified: false,
        adminCreated: true,
        createdBy: user.uid
      });

      alert('Coach profile created successfully!');
      router.push('/admin');
    } catch (error) {
      console.error('Error creating coach profile:', error);
      alert(`Error creating coach profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  const sportTags = availableTags.filter(tag => tag.category === 'sport');
  const specialtyTags = availableTags.filter(tag => tag.category === 'specialty');
  const certificationTags = availableTags.filter(tag => tag.category === 'certification');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Coach</h1>
              <p className="text-sm text-gray-600">Create a new coach profile manually</p>
            </div>
            <Link
              href="/admin"
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Back to Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Essential coach details and contact information.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      id="displayName"
                      required
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      required
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="unique_username"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      3-20 characters, lowercase letters, numbers, and underscores only
                    </p>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio / Description
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Tell us about this coach's background and expertise..."
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Professional Details</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Coaching experience, rates, and location information.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience"
                      id="experience"
                      min="0"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      id="hourlyRate"
                      min="0"
                      step="0.01"
                      value={formData.hourlyRate}
                      onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value) || 0)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="City, State"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sports & Specialties */}
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Sports & Specialties</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select the sports and specialties this coach offers.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="space-y-6">
                  {/* Sports */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sports</label>
                    <div className="grid grid-cols-2 gap-2">
                      {sportTags.map((sport) => (
                        <label key={sport.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.sports.includes(sport.name)}
                            onChange={() => handleArrayChange('sports', sport.name)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{sport.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                    <div className="grid grid-cols-2 gap-2">
                      {specialtyTags.map((specialty) => (
                        <label key={specialty.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.specialties.includes(specialty.name)}
                            onChange={() => handleArrayChange('specialties', specialty.name)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{specialty.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                    <div className="grid grid-cols-2 gap-2">
                      {certificationTags.map((cert) => (
                        <label key={cert.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.certifications.includes(cert.name)}
                            onChange={() => handleArrayChange('certifications', cert.name)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{cert.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Social Media</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Optional social media profiles for the coach.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-2">
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                      Instagram
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      id="instagram"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="@username"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                      Twitter
                    </label>
                    <input
                      type="text"
                      name="twitter"
                      id="twitter"
                      value={formData.socialMedia.twitter}
                      onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="@username"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      id="linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={(e) => handleInputChange('socialMedia.linkedin', e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Coach Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 