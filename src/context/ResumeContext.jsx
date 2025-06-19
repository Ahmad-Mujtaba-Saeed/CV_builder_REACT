// src/contexts/ResumeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ResumeContext = createContext();

// Key for localStorage
const RESUME_STORAGE_KEY = 'resumeData';

export const useResume = () => {
  return useContext(ResumeContext);
};

// Helper function to get data from localStorage
const getStoredResume = () => {
  try {
    const storedData = localStorage.getItem(RESUME_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('Error parsing stored resume data:', error);
    return null;
  }
};

export const ResumeProvider = ({ children }) => {
  // Initialize state with data from localStorage if it exists
  const [parsedResume, setParsedResumeState] = useState(() => getStoredResume());
  const [isParsing, setIsParsing] = useState(false);

  // Update localStorage whenever parsedResume changes
  useEffect(() => {
    if (parsedResume !== null) {
      try {
        localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(parsedResume));
      } catch (error) {
        console.error('Error saving resume to localStorage:', error);
      }
    }
  }, [parsedResume]);

  // Wrapper function to update the state
  const setParsedResume = (data) => {
    setParsedResumeState(data);
  };

  // Function to clear the stored resume
  const clearResume = () => {
    localStorage.removeItem(RESUME_STORAGE_KEY);
    setParsedResumeState(null);
  };

  const value = {
    parsedResume,
    setParsedResume,
    isParsing,
    setIsParsing,
    clearResume, // Export clear function if needed
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};