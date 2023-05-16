import { createContext, useState, ReactNode } from 'react';

interface AppContextProps {
  fetchSuccess: string;
  setFetchSuccess: React.Dispatch<React.SetStateAction<string>>;
  fetchError: string;
  setFetchError: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<AppContextProps>({
  fetchSuccess: '',
  setFetchSuccess: () => {},
  fetchError: '',
  setFetchError: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [fetchSuccess, setFetchSuccess] = useState('');
  const [fetchError, setFetchError] = useState('');

  return (
    <AppContext.Provider value={{ fetchSuccess, setFetchSuccess, fetchError, setFetchError }}>
      {children}
    </AppContext.Provider>
  );
};