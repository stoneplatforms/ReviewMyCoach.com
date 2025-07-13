import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase-client';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';

interface AuthState {
  user: any;
  loading: boolean;
  error: Error | undefined;
  userRole: 'student' | 'coach' | 'admin' | null;
  isCoach: boolean;
}

export function useAuth(): AuthState {
  const [user, loading, error] = useAuthState(auth);
  const [userRole, setUserRole] = useState<'student' | 'coach' | 'admin' | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserRole(userData.role || null);
          }
        } catch (error) {
          console.error('Error checking user role:', error);
        }
      } else {
        setUserRole(null);
      }
    };

    checkUserRole();
  }, [user]);

  return {
    user,
    loading,
    error,
    userRole,
    isCoach: userRole === 'coach'
  };
} 