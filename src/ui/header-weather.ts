// China Monitor — Header Weather Display

export class HeaderWeather {
  private tempElement: HTMLElement | null = null
  private iconElement: HTMLElement | null = null
  private locationElement: HTMLElement | null = null
  private weatherDisplay: HTMLElement | null = null

  constructor() {
    this.tempElement = document.getElementById('weather-temp')
    this.iconElement = document.getElementById('weather-icon')
    this.locationElement = document.getElementById('weather-location')
    this.weatherDisplay = document.querySelector('.weather-display')
  }

  async init(): Promise<void> {
    if (!this.tempElement || !this.iconElement || !this.locationElement) {
      console.error('Header weather elements not found')
      return
    }

    // Hide weather display initially (only show if geolocation granted)
    if (this.weatherDisplay) {
      this.weatherDisplay.style.display = 'none'
    }

    await this.loadLocalWeather()
    setInterval(() => this.loadLocalWeather(), 30 * 60 * 1000)
  }

  private async loadLocalWeather(): Promise<void> {
    try {
      // Try browser geolocation first
      if ('geolocation' in navigator) {
        const position = await this.getGeolocation()
        if (position) {
          await this.fetchWeather(position.coords.latitude, position.coords.longitude)
          return
        }
      }
      // Fallback to IP-based location
      await this.fetchWeatherByIP()
    } catch (error) {
      console.error('Failed to get local weather:', error)
      // Hide weather on error
      this.hideWeatherDisplay()
    }
  }

  private getGeolocation(): Promise<GeolocationPosition | null> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position)
        },
        (_error) => {
          // Hide weather display if permission denied
          this.hideWeatherDisplay()
          resolve(null)
        },
        { timeout: 5000, maximumAge: 300000 }
      )
    })
  }

  private hideWeatherDisplay(): void {
    if (this.weatherDisplay) {
      this.weatherDisplay.classList.remove('show')
      setTimeout(() => {
        this.weatherDisplay!.style.display = 'none'
      }, 400)
    }
  }

  private showWeatherDisplay(): void {
    if (this.weatherDisplay) {
      this.weatherDisplay.style.display = 'flex'
      // Trigger reflow to restart animation
      void this.weatherDisplay.offsetWidth
      this.weatherDisplay.classList.add('show')
    }
  }

  private async fetchWeatherByIP(): Promise<void> {
    try {
      // Browser directly fetches from wttr.in (uses browser's IP for location)
      const response = await fetch('https://wttr.in/?format=3', { 
        mode: 'cors',
        cache: 'no-cache'
      })
      const text = await response.text()
      
      // Parse: "los angeles: ☀️   +22°C"
      const match = text.match(/^(.+?):\s*(\S+)\s*([+-]?\d+)°C/)
      if (match) {
        const location = match[1].trim()
        const weatherEmoji = match[2].trim()
        const tempC = parseInt(match[3])
        const tempF = Math.round(tempC * 9/5 + 32)
        
        // Set location with capitalization
        if (this.locationElement) {
          const capitalizedLocation = location.split(' ').map((word: string) => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ')
          this.locationElement.textContent = capitalizedLocation
        }
        
        // Map emoji to DSEG Weather icon
        const icon = this.getWeatherIconFromEmoji(weatherEmoji)
        
        if (this.iconElement) {
          this.iconElement.textContent = icon
        }
        
        if (this.tempElement) {
          this.tempElement.textContent = `${tempC}°C / ${tempF}°F`
        }
        
        // Show weather display
        this.showWeatherDisplay()
      }
    } catch (error) {
      // Hide weather display on error
      this.hideWeatherDisplay()
    }
  }

  private getWeatherIconFromEmoji(emoji: string): string {
    if (emoji.includes('☀') || emoji.includes('☼')) return '1'  // Sunny
    if (emoji.includes('☁') || emoji.includes('☂')) return '2'  // Cloudy
    if (emoji.includes('🌧') || emoji.includes('🌦')) return '3'  // Rain
    if (emoji.includes('🌨') || emoji.includes('❄')) return '5'  // Snow
    if (emoji.includes('⛈') || emoji.includes('🌩')) return '6'  // Thunder
    if (emoji.includes('🌫') || emoji.includes('🌁')) return '2'  // Fog/Mist
    return '1'  // Default to sunny
  }



  private async fetchWeather(_lat: number, _lon: number): Promise<void> {
    // Always use wttr.in without coordinates (uses browser's IP for location)
    await this.fetchWeatherByIP()
  }
}
