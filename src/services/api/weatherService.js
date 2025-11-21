import { getApperClient } from "@/services/apperClient";

class WeatherService {
  constructor() {
    this.tableName = 'weather_c';
  }

  async getCurrentWeather() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "current_temperature_c"}},
          {"field": {"Name": "current_humidity_c"}},
          {"field": {"Name": "current_condition_c"}},
          {"field": {"Name": "forecast_c"}},
          {"field": {"Name": "alerts_c"}}
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        },
        orderBy: [{
          fieldName: "CreatedOn",
          sorttype: "DESC"
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        // Return mock current weather if no data available
        return this.getMockCurrentWeather();
      }

      const weatherData = response.data?.[0];
      if (!weatherData) {
        return this.getMockCurrentWeather();
      }

      return {
        temperature: weatherData.current_temperature_c || 22,
        humidity: weatherData.current_humidity_c || 65,
        condition: weatherData.current_condition_c || "partly_cloudy",
        location: weatherData.location_c || "Farm Location",
        date: new Date().toISOString(),
        windSpeed: 12,
        precipitation: 0,
        pressure: 1013
      };
    } catch (error) {
      console.error("Error fetching current weather:", error?.response?.data?.message || error);
      return this.getMockCurrentWeather();
    }
  }

  async getForecast(days = 7) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "forecast_c"}}
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        },
        orderBy: [{
          fieldName: "CreatedOn",
          sorttype: "DESC"
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return this.getMockForecast(days);
      }

      const weatherData = response.data?.[0];
      if (!weatherData || !weatherData.forecast_c) {
        return this.getMockForecast(days);
      }

      try {
        const forecast = JSON.parse(weatherData.forecast_c);
        return forecast.slice(0, days);
      } catch (parseError) {
        console.error("Error parsing forecast data:", parseError);
        return this.getMockForecast(days);
      }
    } catch (error) {
      console.error("Error fetching forecast:", error?.response?.data?.message || error);
      return this.getMockForecast(days);
    }
  }

  async getWeatherAlerts() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "alerts_c"}}
        ],
        pagingInfo: {
          limit: 10,
          offset: 0
        },
        orderBy: [{
          fieldName: "CreatedOn",
          sorttype: "DESC"
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      const alerts = [];
      for (const record of response.data || []) {
        if (record.alerts_c) {
          try {
            const recordAlerts = JSON.parse(record.alerts_c);
            alerts.push(...recordAlerts);
          } catch (parseError) {
            console.error("Error parsing alerts data:", parseError);
          }
        }
      }

      return alerts;
    } catch (error) {
      console.error("Error fetching weather alerts:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getHistoricalData(startDate, endDate) {
    try {
      // For now, generate mock historical data since it's not stored in database
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const historical = [];
      
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        historical.push({
          date: date.toISOString(),
          temperature: 18 + Math.random() * 12,
          precipitation: Math.random() * 8,
          humidity: 45 + Math.random() * 35,
          condition: ["sunny", "cloudy", "partly_cloudy", "rainy"][Math.floor(Math.random() * 4)]
        });
      }
      
      return historical;
    } catch (error) {
      console.error("Error generating historical data:", error);
      return [];
    }
  }

  getMockCurrentWeather() {
    return {
      temperature: 22,
      humidity: 65,
      condition: "partly_cloudy",
      location: "Farm Location",
      date: new Date().toISOString(),
      windSpeed: 12,
      precipitation: 0,
      pressure: 1013
    };
  }

  getMockForecast(days) {
    const forecast = [];
    const conditions = ["sunny", "cloudy", "partly_cloudy", "rainy"];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toISOString(),
        tempMax: 20 + Math.random() * 10,
        tempMin: 15 + Math.random() * 5,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        precipitation: Math.random() * 5,
        humidity: 50 + Math.random() * 30,
        windSpeed: 8 + Math.random() * 8
      });
    }
    
    return forecast;
  }
}

export default new WeatherService();
export default new WeatherService();