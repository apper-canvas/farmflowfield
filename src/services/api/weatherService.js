import weatherData from "@/services/mockData/weather.json";

class WeatherService {
  constructor() {
    this.weather = { ...weatherData };
  }

  async getCurrentWeather() {
    await this.delay();
    return {
      ...this.weather.current,
      date: new Date().toISOString()
    };
  }

  async getForecast(days = 7) {
    await this.delay();
    return this.weather.forecast.slice(0, days);
  }

  async getWeatherAlerts() {
    await this.delay();
    return this.weather.alerts || [];
  }

  async getHistoricalData(startDate, endDate) {
    await this.delay();
    // Simulate historical data
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const historical = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      historical.push({
        date: date.toISOString(),
        temperature: 20 + Math.random() * 15,
        precipitation: Math.random() * 10,
        humidity: 40 + Math.random() * 40,
        condition: ["sunny", "cloudy", "rainy"][Math.floor(Math.random() * 3)]
      });
    }
    
    return historical;
  }

  async delay(ms = 400) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new WeatherService();