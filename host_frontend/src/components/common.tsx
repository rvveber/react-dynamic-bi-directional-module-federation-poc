import React from 'react';

/**
 * Standardized loading state component
 */
export const LoadingState: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => (
  <div className="loading-state">
    {message}
  </div>
);

/**
 * Standardized error state component
 */
export const ErrorState: React.FC<{ message?: string }> = ({ 
  message = "Something went wrong" 
}) => (
  <div className="error-state">
    {message}
  </div>
);
