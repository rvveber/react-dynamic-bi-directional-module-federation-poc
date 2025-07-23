import React, { useState, useEffect } from 'react';

interface InjectionCountdownProps {
  position: string;
  onComplete: () => void;
}

const InjectionCountdown: React.FC<InjectionCountdownProps> = ({ position, onComplete }) => {
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  if (count === 0) return null;

  return (
    <div className="countdown-container">
      {/* Circular countdown */}
      <div className="countdown-circle">
        {count}
      </div>
      
      {/* Subtitle */}
      <div className="countdown-subtitle">
        Plugin injection starting...
      </div>
      
      {/* Description */}
      <div className="countdown-description">
        Plugins will automatically inject into the page
      </div>
    </div>
  );
};

export default InjectionCountdown;
