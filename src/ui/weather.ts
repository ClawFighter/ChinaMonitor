// China Monitor — Weather Display
// Gets weather using Open-Meteo API (fixed location for reliability)

interface WeatherData {
  temperature_2m: number
  relative_humidity_2m: number
  weather_code: number
}

export class WeatherDisplay {
  private weatherIconElement: HTMLElement | null = null
  private weatherTempElement: HTMLElement | null = null
  private weatherHumidityElement: HTMLElement | null = null
  private weatherCode: number = 0

  constructor() {
    this.weatherIconElement = document.getElementById('weather-icon')
    this.weatherTempElement = document.getElementById('weather-temp')
    this.weatherHumidityElement = document.getElementById('weather-humidity')
  }

  async init(): Promise<void> {
    if (!this.weatherIconElement || !this.weatherTempElement || !this.weatherHumidityElement) {
      console.error('Weather elements not found')
      return
    }
    await this.loadWeather()
  }

  async loadWeather(): Promise<void> {
    try {
      // Use fixed location (Beijing) for reliable demo
      // In production, you might want to use geolocation with permission handling
      const latitude = 39.9042
      const longitude = 116.4074
      
      // Show loading state
      if (this.weatherTempElement) this.weatherTempElement.textContent = '--'
      if (this.weatherHumidityElement) this.weatherHumidityElement.textContent = '--'
      
      // Fetch weather from Open-Meteo
      const weather = await this.getWeather(latitude, longitude)
      if (weather) {
        if (this.weatherTempElement) this.weatherTempElement.textContent = `${Math.round(weather.temperature_2m)}°C`
        if (this.weatherHumidityElement) this.weatherHumidityElement.textContent = `${weather.relative_humidity_2m}%`
        this.weatherCode = weather.weather_code
        this.updateWeatherIcon()
      } else {
        if (this.weatherTempElement) this.weatherTempElement.textContent = 'N/A'
        if (this.weatherHumidityElement) this.weatherHumidityElement.textContent = 'N/A'
      }
    } catch (err) {
      console.error('Failed to load weather:', err)
      if (this.weatherTempElement) this.weatherTempElement.textContent = 'ERR'
      if (this.weatherHumidityElement) this.weatherHumidityElement.textContent = 'ERR'
    }
  }

  private async getWeather(lat: number, lon: number): Promise<WeatherData | null> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      return {
        temperature_2m: data.current.temperature_2m,
        relative_humidity_2m: data.current.relative_humidity_2m,
        weather_code: data.current.weather_code
      }
    } catch (err) {
      console.error('Weather API error:', err)
      return null
    }
  }

  private updateWeatherIcon(): void {
    if (!this.weatherIconElement) return

    // WMO weather code interpretation
    const codes: Record<number, string> = {
      0: 'fa-sun',           // Clear sky
      1: 'fa-cloud-sun',     // Mainly clear
      2: 'fa-cloud-sun',     // Partially cloudy
      3: 'fa-cloud',         // Overcast
      45: 'fa-smog',         // Fog
      48: 'fa-smog',         // Deposting fog
      51: 'fa-rain',         // Light drizzle
      53: 'fa-rain',         // Moderate drizzle
      55: 'fa-rain',         // Dense drizzle
      61: 'fa-rain',         // Slight rain
      63: 'fa-rain',         // Moderate rain
      65: 'fa-rain',         // Heavy rain
      71: 'fa-snow',         // Slight snow
      73: 'fa-snow',         // Moderate snow
      75: 'fa-snow',         // Heavy snow
      80: 'fa-rain',         // Slight rain showers
      81: 'fa-rain',         // Moderate rain showers
      82: 'fa-rain',         // Violent rain showers
      95: 'fa-thunderstorm', // Thunderstorm
      96: 'fa-thunderstorm', // Thunderstorm with hail
      99: 'fa-thunderstorm'  // Thunderstorm with heavy hail
    }

    const iconClass = codes[this.weatherCode] || 'fa-question'
    this.weatherIconElement.className = `fa-solid ${iconClass}`
  }
}
