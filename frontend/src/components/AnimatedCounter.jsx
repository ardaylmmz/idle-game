import React, { useState, useEffect } from "react";

const AnimatedCounter = ({ value, formatNumber, duration = 1000, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const difference = value - displayValue;
      const startValue = displayValue;
      const startTime = Date.now();

      const animateValue = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (difference * easeOutQuart);
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animateValue);
        } else {
          setDisplayValue(value);
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animateValue);
    }
  }, [value, displayValue, duration]);

  return (
    <span className={`${className} ${isAnimating ? 'animate-pulse' : ''} transition-all duration-300`}>
      {formatNumber(displayValue)}
    </span>
  );
};

export default AnimatedCounter;