import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import { UserRole } from '../types';

interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  isAdmin: boolean;
}

interface UserContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// List of admin emails (add your admin emails here)
const ADMIN_EMAILS = ['admin@example.com', 'admin@internal.com', 'eash@gmail.com'];

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for active session on mount
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email || '';
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || email,
          email,
          isAdmin: ADMIN_EMAILS.includes(email)
        });
        setIsAdmin(ADMIN_EMAILS.includes(email));
      }
    });
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || '';
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || email,
          email,
          isAdmin: ADMIN_EMAILS.includes(email)
        });
        setIsAdmin(ADMIN_EMAILS.includes(email));
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    // User will be set by the auth state change listener
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return (
    <UserContext.Provider value={{ currentUser, isAdmin, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 