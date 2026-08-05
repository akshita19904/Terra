import React, { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { DevModeProvider } from './context/DevModeContext';

export function App() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
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

  return (
    <DevModeProvider>
      {!token || !user ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </DevModeProvider>
  );
}

export default App;
