
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse, User } from '@/lib/types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      if (token) {
        // If we have a token but no user info, we could fetch user details here
        // For now, we'll create a minimal user object
        setUser({ id: 'current', email: 'user@example.com' });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const response = await authService.login({ email, password });
    setIsLoading(false);
    
    if (response) {
      setUser(response.user);
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const user = await authService.register({ email, password });
    setIsLoading(false);
    
    return !!user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
