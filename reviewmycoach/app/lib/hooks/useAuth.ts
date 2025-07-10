import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase-client';

interface AuthState {
  user: any;
  loading: boolean;
  error: Error | undefined;
}

export function useAuth(): AuthState {
  const [user, loading, error] = useAuthState(auth);

  return {
    user,
    loading,
    error
  };
} 