// src/contexts/ResumeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CurrentQuestionContext = createContext();

// Key for localStorage
const CURRENT_QUESTION_STORAGE_KEY = 'currentQuestionData';

export const useCurrentQuestion = () => {
  return useContext(CurrentQuestionContext);
};

export { CurrentQuestionContext };

// Helper function to get data from localStorage
const getStoredCurrentQuestion = () => {
  try {
    const storedData = localStorage.getItem(CURRENT_QUESTION_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('Error parsing stored current question data:', error);
    return null;
  }
};

export const CurrentQuestionProvider = ({ children }) => {
  // Initialize state with data from localStorage if it exists
  const [currentQuestion, setCurrentQuestionState] = useState(() => getStoredCurrentQuestion());
  const [isParsing, setIsParsing] = useState(false);

  // Update localStorage whenever parsedFeedback changes
  useEffect(() => {
    if (currentQuestion !== null) {
      try {
        localStorage.setItem(CURRENT_QUESTION_STORAGE_KEY, JSON.stringify(currentQuestion));
      } catch (error) {
        console.error('Error saving current question to localStorage:', error);
      }
    }
  }, [currentQuestion]);

  // Wrapper function to update the state
  const setCurrentQuestion = (data) => {
    setCurrentQuestionState(data);
  };

  // Function to clear the stored feedback
  const clearCurrentQuestion = () => {
    localStorage.removeItem(CURRENT_QUESTION_STORAGE_KEY);
    setCurrentQuestionState(null);
  };

  const value = {
    currentQuestion,
    setCurrentQuestion,
    isParsing,
    setIsParsing,
    clearCurrentQuestion,
  };

  return (
    <CurrentQuestionContext.Provider value={value}>
      {children}
    </CurrentQuestionContext.Provider>
  );
};