// src/contexts/ResumeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const FeedbackContext = createContext();

// Key for localStorage
const FEEDBACK_STORAGE_KEY = 'feedbackData';

export const useFeedback = () => {
  return useContext(FeedbackContext);
};

export { FeedbackContext };

// Helper function to get data from localStorage
const getStoredFeedback = () => {
  try {
    const storedData = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('Error parsing stored feedback data:', error);
    return null;
  }
};

export const FeedbackProvider = ({ children }) => {
  // Initialize state with data from localStorage if it exists
  const [parsedFeedback, setParsedFeedbackState] = useState(() => getStoredFeedback());
  const [isParsing, setIsParsing] = useState(false);

  // Update localStorage whenever parsedFeedback changes
  useEffect(() => {
    if (parsedFeedback !== null) {
      try {
        localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(parsedFeedback));
      } catch (error) {
        console.error('Error saving feedback to localStorage:', error);
      }
    }
  }, [parsedFeedback]);

  // Wrapper function to update the state
  const setParsedFeedback = (data) => {
    setParsedFeedbackState(data);
  };

  // Function to clear the stored feedback
  const clearFeedback = () => {
    localStorage.removeItem(FEEDBACK_STORAGE_KEY);
    setParsedFeedbackState(null);
  };

  const value = {
    parsedFeedback,
    setParsedFeedback,
    isParsing,
    setIsParsing,
    clearFeedback,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};