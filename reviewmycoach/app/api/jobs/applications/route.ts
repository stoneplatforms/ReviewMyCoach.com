import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, query, where, orderBy, getDocs, updateDoc, addDoc, Query, DocumentData } from 'firebase/firestore';
import { auth } from '../../../lib/firebase-admin';

// Initialize Firebase client
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const clientApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const clientDb = getFirestore(clientApp);

// GET - Fetch job applications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');

    if (!userId && !jobId) {
      return NextResponse.json({ error: 'Either userId or jobId is required' }, { status: 400 });
    }

    const applicationsRef = collection(clientDb, 'job_applications');
    let applicationsQuery: Query<DocumentData>;

    if (userId) {
      // Get applications by coach
      applicationsQuery = query(
        applicationsRef,
        where('coachId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    } else {
      // Get applications for a specific job
      applicationsQuery = query(
        applicationsRef,
        where('jobId', '==', jobId!),
        orderBy('createdAt', 'desc')
      );
    }

    if (status) {
      applicationsQuery = query(applicationsQuery, where('status', '==', status));
    }

    const snapshot = await getDocs(applicationsQuery);
    const applications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));

    return NextResponse.json({ applications });

  } catch (error) {
    console.error('Error fetching job applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job applications' },
      { status: 500 }
    );
  }
}

// POST - Create a new job application
export async function POST(request: NextRequest) {
  try {
    const { jobId, coverLetter, hourlyRate, estimatedHours, availability, idToken } = await request.json();

    // Verify authentication
    if (!idToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    const userId = decodedToken.uid;

    // Check if user is a coach and has active subscription
    const coachesRef = collection(clientDb, 'coaches');
    const coachQuery = query(coachesRef, where('userId', '==', userId));
    const coachSnapshot = await getDocs(coachQuery);

    if (coachSnapshot.empty) {
      return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 });
    }

    const coachDoc = coachSnapshot.docs[0];
    const coachData = coachDoc.data();

    // Verify subscription status
    if (coachData.subscriptionStatus !== 'active') {
      return NextResponse.json({ 
        error: 'Coach Pro subscription required to apply for jobs' 
      }, { status: 403 });
    }

    // Check if job exists
    const jobRef = doc(clientDb, 'jobs', jobId);
    const jobDoc = await getDoc(jobRef);

    if (!jobDoc.exists()) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const jobData = jobDoc.data();

    // Check if coach has already applied
    const existingApplicationQuery = query(
      collection(clientDb, 'job_applications'),
      where('jobId', '==', jobId),
      where('coachId', '==', userId)
    );
    const existingSnapshot = await getDocs(existingApplicationQuery);

    if (!existingSnapshot.empty) {
      return NextResponse.json({ error: 'You have already applied for this job' }, { status: 400 });
    }

    // Validate required fields
    if (!coverLetter || !hourlyRate || !estimatedHours || !availability) {
      return NextResponse.json({ error: 'All application fields are required' }, { status: 400 });
    }

    // Create application
    const applicationData = {
      jobId,
      coachId: userId,
      coachName: coachData.displayName,
      coachUsername: coachData.username,
      jobTitle: jobData.title,
      jobPostedBy: jobData.postedBy,
      coverLetter,
      hourlyRate: parseFloat(hourlyRate),
      estimatedHours: parseFloat(estimatedHours),
      availability,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const applicationRef = await addDoc(collection(clientDb, 'job_applications'), applicationData);

    // Update job applicant count
    await updateDoc(jobRef, {
      applicants: (jobData.applicants || 0) + 1,
      updatedAt: new Date(),
    });

    // Send email notification to job poster
    try {
      const jobPosterEmail = jobData.posterEmail;
      if (jobPosterEmail) {
        await fetch('/api/notifications/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'job_application',
            recipientEmail: jobPosterEmail,
            recipientName: 'Job Poster',
            data: {
              jobTitle: jobData.title,
              applicantName: coachData.displayName,
              hourlyRate: parseFloat(hourlyRate),
              estimatedHours: parseFloat(estimatedHours),
              availability,
              coverLetter
            },
            idToken: idToken
          }),
        });
      }
    } catch (error) {
      console.error('Error sending job application email:', error);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      applicationId: applicationRef.id,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Error creating job application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

// PUT - Update job application status
export async function PUT(request: NextRequest) {
  try {
    const { applicationId, status, feedback, idToken } = await request.json();

    // Verify authentication
    if (!idToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

      let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
  }

    const userId = decodedToken.uid;

    // Get application
    const applicationRef = doc(clientDb, 'job_applications', applicationId);
    const applicationDoc = await getDoc(applicationRef);

    if (!applicationDoc.exists()) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const applicationData = applicationDoc.data();

    // Check if user is the job poster (can accept/reject applications)
    if (applicationData.jobPostedBy !== userId) {
      return NextResponse.json({ error: 'Unauthorized to update this application' }, { status: 403 });
    }

    // Update application
    await updateDoc(applicationRef, {
      status,
      feedback: feedback || '',
      updatedAt: new Date(),
    });

    // Send email notification to applicant
    try {
      const coachesRef = collection(clientDb, 'coaches');
      const coachQuery = query(coachesRef, where('userId', '==', applicationData.coachId));
      const coachSnapshot = await getDocs(coachQuery);

      if (!coachSnapshot.empty) {
        const coachDoc = coachSnapshot.docs[0];
        const coachData = coachDoc.data();
        const coachEmail = coachData.email;

        if (coachEmail) {
          await fetch('/api/notifications/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'application_status',
              recipientEmail: coachEmail,
              recipientName: coachData.displayName,
              data: {
                jobTitle: applicationData.jobTitle,
                status,
                feedback: feedback || ''
              },
              idToken: idToken
            }),
          });
        }
      }
    } catch (error) {
      console.error('Error sending application status email:', error);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Application updated successfully'
    });

  } catch (error) {
    console.error('Error updating job application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
} 