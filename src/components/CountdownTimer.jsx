import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set event date - March 10, 2025
    const eventDate = new Date('2025-04-18T09:00:00').getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
      
      if (distance < 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white py-8 shadow-xl rounded-3xl max-w-5xl mx-auto -mt-8 relative z-10 mb-16 border border-secondary-100">
      <h2 className="text-center text-xl font-bold text-secondary-800 mb-4">Event Starts In</h2>
      <div className="grid grid-cols-4 gap-3 px-4">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center">
            <div className="w-full bg-secondary-50 rounded-lg py-3 px-2 text-center shadow-inner">
              <span className="block text-3xl font-bold text-primary-600">{value}</span>
            </div>
            <span className="mt-2 text-secondary-600 capitalize">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
