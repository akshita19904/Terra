import React, { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';

export function App() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Read persisted token & user session on mount
    const savedToken = localStorage.getItem('terra_token');
    const savedUser = localStorage.getItem('terra_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('terra_token');
        localStorage.removeItem('terra_user');
      }
    }
    setIsInitializing(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: any, authToken: string) => {
    setUser(loggedInUser);
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('terra_token');
    localStorage.removeItem('terra_user');
    setUser(null);
    setToken(null);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#07111F] flex items-center justify-center text-mint font-bold text-sm">
        Initializing Terra Workspace...
      </div>
    );
  }

  // Auth Guard: Unauthenticated users are redirected to LoginPage
  if (!token || !user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Protected App Shell
  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
