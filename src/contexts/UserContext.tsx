import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulated login
    if (email === 'admin@example.com' && password === 'admin') {
      setCurrentUser({
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
      });
      return {};
    }
    return { error: 'Invalid credentials' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 