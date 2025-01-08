import React, { useState, useEffect } from 'react';

// Function to get the current date and day in short format
const getCurrentDate = () => {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('en-US', options);
  return currentDate;
};

const Header = () => {
  const [temperature, setTemperature] = useState(null);
  const [condition, setCondition] = useState(null);
  const [icon, setIcon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch weather data
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=7fe15d37797741d281a143204250301&q=varanasi`
        );
        const data = await response.json();
        if (data.current) {
          setTemperature(data.current.temp_c); // Setting the temperature in Celsius
          setCondition(data.current.condition.text); // Weather condition (e.g., Clear)
          setIcon(data.current.condition.icon); // Weather icon
        } else {
          setError('Unable to fetch temperature');
        }
      } catch (error) {
        setError('Unable to fetch temperature');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <header className="bg-gray-100 p-6 flex justify-between items-center h-32 relative">
      {/* Left side: Date and Day (Visible on medium screens and larger) */}
      <div className="text-lg text-gray-700 hidden md:block bg-gray-200 p-2 rounded-lg shadow-md">
        {getCurrentDate()}
      </div>

      {/* Centered Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl font-extrabold text-center text-gray-800">
        The Latest News
      </div>

      {/* Right side: Temperature and Weather Condition (Visible on medium screens and larger) */}
      <div className="text-lg text-gray-700 hidden md:block bg-gray-200 p-2 rounded-lg shadow-md flex items-center space-x-2">
        {loading ? (
          <span>Loading...</span>
        ) : error ? (
          <span>{error}</span>
        ) : (
          <>
            {/* Weather Icon */}
            <img
              src={`https:${icon}`} // The API provides a relative URL, so we need to add "https:" at the beginning
              alt={condition}
              className="w-6 h-6"
            />
            <span>{temperature}°C - {condition}</span> {/* Display the temperature and condition */}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
