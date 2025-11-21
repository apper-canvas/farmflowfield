import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import weatherService from "@/services/api/weatherService";

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError("");

      const [current, forecastData, alertsData] = await Promise.all([
        weatherService.getCurrentWeather(),
        weatherService.getForecast(7),
        weatherService.getWeatherAlerts()
      ]);

      setCurrentWeather(current);
      setForecast(forecastData);
      setAlerts(alertsData);
    } catch (err) {
      setError(err.message || "Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: "Sun",
      partly_cloudy: "CloudSun", 
      cloudy: "Cloud",
      rainy: "CloudRain",
      stormy: "CloudLightning",
      snowy: "CloudSnow",
      windy: "Wind"
    };
    return icons[condition] || "Sun";
  };

  const getConditionColor = (condition) => {
    const colors = {
      sunny: "text-yellow-500",
      partly_cloudy: "text-blue-400",
      cloudy: "text-gray-500",
      rainy: "text-blue-600",
      stormy: "text-purple-600",
      snowy: "text-blue-300",
      windy: "text-gray-600"
    };
    return colors[condition] || "text-yellow-500";
  };

  const getAlertVariant = (severity) => {
    switch (severity) {
      case "high": return "error";
      case "medium": return "warning"; 
      case "low": return "info";
      default: return "default";
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadWeatherData} />;

  const selectedForecast = forecast[selectedDay];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Weather Dashboard</h1>
        <p className="text-gray-600">Current conditions and 7-day forecast</p>
      </div>

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className="p-4 border-l-4 border-l-warning">
              <div className="flex items-start space-x-3">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                    <Badge variant={getAlertVariant(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(alert.startDate), "MMM d, h:mm a")} - 
                    {format(new Date(alert.endDate), "MMM d, h:mm a")}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Current Weather */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <ApperIcon 
              name={getWeatherIcon(currentWeather?.condition)} 
              className={`w-16 h-16 ${getConditionColor(currentWeather?.condition)}`}
            />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {currentWeather?.temperature}°C
          </h2>
          
          <p className="text-lg text-gray-700 capitalize mb-4">
            {currentWeather?.condition?.replace("_", " ")}
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <ApperIcon name="Droplets" className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900">{currentWeather?.humidity}%</div>
              <div className="text-xs text-gray-600">Humidity</div>
            </div>
            
            <div>
              <ApperIcon name="Wind" className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900">{currentWeather?.windSpeed} km/h</div>
              <div className="text-xs text-gray-600">Wind Speed</div>
            </div>
            
            <div>
              <ApperIcon name="CloudRain" className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900">{currentWeather?.precipitation} mm</div>
              <div className="text-xs text-gray-600">Precipitation</div>
            </div>
            
            <div>
              <ApperIcon name="Gauge" className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900">{currentWeather?.pressure} hPa</div>
              <div className="text-xs text-gray-600">Pressure</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 7-Day Forecast */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">7-Day Forecast</h3>
        
        {/* Forecast Tabs */}
        <div className="flex overflow-x-auto space-x-2 mb-4 pb-2">
          {forecast.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`flex-shrink-0 p-3 rounded-lg text-center min-w-[100px] transition-all duration-200 ${
                selectedDay === index
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="text-sm font-medium mb-1">
                {index === 0 ? "Today" : format(new Date(day.date), "EEE")}
              </div>
              <ApperIcon 
                name={getWeatherIcon(day.condition)} 
                className={`w-6 h-6 mx-auto mb-1 ${
                  selectedDay === index ? "text-white" : getConditionColor(day.condition)
                }`}
              />
              <div className="text-xs">
                {day.tempMax}°/{day.tempMin}°
              </div>
            </button>
          ))}
        </div>

        {/* Selected Day Details */}
        {selectedForecast && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {selectedDay === 0 ? "Today" : format(new Date(selectedForecast.date), "EEEE, MMMM d")}
              </h4>
              <Badge variant="primary" className="capitalize">
                {selectedForecast.condition?.replace("_", " ")}
              </Badge>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <ApperIcon name="Thermometer" className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedForecast.tempMax}°C
                </div>
                <div className="text-sm text-gray-600">High</div>
                <div className="text-lg text-gray-700 mt-1">
                  {selectedForecast.tempMin}°C
                </div>
                <div className="text-xs text-gray-500">Low</div>
              </div>

              <div className="text-center">
                <ApperIcon name="CloudRain" className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedForecast.precipitation} mm
                </div>
                <div className="text-sm text-gray-600">Rain</div>
              </div>

              <div className="text-center">
                <ApperIcon name="Droplets" className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedForecast.humidity}%
                </div>
                <div className="text-sm text-gray-600">Humidity</div>
              </div>

              <div className="text-center">
                <ApperIcon name="Wind" className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedForecast.windSpeed} km/h
                </div>
                <div className="text-sm text-gray-600">Wind</div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Farm Recommendations */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-primary-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Lightbulb" className="w-5 h-5 text-primary mr-2" />
          Farm Recommendations
        </h3>
        
        <div className="space-y-3">
          {currentWeather?.precipitation > 10 && (
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <ApperIcon name="CloudRain" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Heavy Rain Expected</p>
                <p className="text-xs text-blue-700">Consider postponing spraying activities and protect sensitive crops.</p>
              </div>
            </div>
          )}
          
          {currentWeather?.windSpeed > 15 && (
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <ApperIcon name="Wind" className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">High Wind Conditions</p>
                <p className="text-xs text-yellow-700">Avoid aerial spraying and secure loose equipment.</p>
              </div>
            </div>
          )}
          
          {currentWeather?.temperature > 30 && (
            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <ApperIcon name="Sun" className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">High Temperature</p>
                <p className="text-xs text-orange-700">Increase irrigation frequency and provide shade for sensitive crops.</p>
              </div>
            </div>
          )}
          
          {!currentWeather?.precipitation && currentWeather?.temperature >= 18 && currentWeather?.temperature <= 25 && (
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Ideal Conditions</p>
                <p className="text-xs text-green-700">Perfect weather for most farm activities and fieldwork.</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Refresh Button */}
      <div className="text-center">
        <Button onClick={loadWeatherData} variant="outline">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Refresh Weather Data
        </Button>
      </div>
    </div>
  );
};

export default Weather;