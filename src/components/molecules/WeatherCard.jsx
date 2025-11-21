import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const WeatherCard = ({ weather }) => {
  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: "Sun",
      cloudy: "Cloud",
      rainy: "CloudRain", 
      stormy: "CloudLightning",
      snowy: "CloudSnow",
      windy: "Wind"
    };
    return icons[condition?.toLowerCase()] || "Sun";
  };

  if (!weather) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-700 font-medium">Current Weather</p>
          <div className="flex items-center space-x-2 mt-1">
            <ApperIcon 
              name={getWeatherIcon(weather.condition)} 
              className="w-6 h-6 text-blue-600" 
            />
            <span className="text-xl font-bold text-blue-900">
              {weather.temperature}°C
            </span>
          </div>
          <p className="text-sm text-blue-600 capitalize mt-1">
            {weather.condition}
          </p>
        </div>
        
        <div className="text-right text-sm text-blue-700">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Droplets" className="w-4 h-4" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <ApperIcon name="Wind" className="w-4 h-4" />
            <span>{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;