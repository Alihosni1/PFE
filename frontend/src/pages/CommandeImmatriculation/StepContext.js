import React, { createContext, useState, useContext } from 'react';

const StepContext = createContext();

export const StepProvider = ({ children }) => {
  const [completedSteps, setCompletedSteps] = useState([]);

  const markStepComplete = (stepIndex) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  return (
    <StepContext.Provider value={{ completedSteps, markStepComplete }}>
      {children}
    </StepContext.Provider>
  );
};

export const useStep = () => useContext(StepContext);
