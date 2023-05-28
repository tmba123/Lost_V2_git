import { createContext, useState, ReactNode } from 'react'

interface AppContextProps {  // Context values and setter functions.
  fetchSuccess: string
  setFetchSuccess: React.Dispatch<React.SetStateAction<string>>
  fetchError: string
  setFetchError: React.Dispatch<React.SetStateAction<string>>
}

export const AppContext = createContext<AppContextProps>({ //Creates context empty string and functions
  fetchSuccess: '',
  setFetchSuccess: () => { },
  fetchError: '',
  setFetchError: () => { },
})

interface AppProviderProps { // Specify the type of the children props the AppProvider component will receive.
  children: ReactNode
}

//Wraps children with the AppContext.Provider. It also sets up the state and provides the values for the context.
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [fetchSuccess, setFetchSuccess] = useState('')
  const [fetchError, setFetchError] = useState('')

  return (
    //Provides the state values and setter functions as the value of the context
    <AppContext.Provider value={{ fetchSuccess, setFetchSuccess, fetchError, setFetchError }}>
      {children}
    </AppContext.Provider>
  )
}