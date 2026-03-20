// China Monitor — Clock Display

export class ClockDisplay {
  private clockElement: HTMLElement | null = null

  constructor() {
    this.clockElement = document.getElementById('clock')
  }

  init(): void {
    if (!this.clockElement) {
      console.error('Clock element not found')
      return
    }
    this.update()
    setInterval(() => this.update(), 1000)
    
    window.addEventListener('resize', () => this.update())
  }

  private update(): void {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    const timeString = `${hours}:${minutes}:${seconds}`
    const dateString = `${year}-${month}-${day}`
    const weekday = now.toLocaleDateString(undefined, { weekday: 'short' })
    
    const isMobile = window.innerWidth <= 768
    
    if (isMobile) {
      this.clockElement!.innerHTML = `<span class="clock-time">${timeString}</span>`
    } else {
      this.clockElement!.innerHTML = `<span class="clock-time">${timeString}</span> <span class="clock-date" style="font-size: 0.5em; opacity: 0.8;">${weekday}</span> <span class="clock-date" style="font-size: 0.5em; opacity: 0.8;">${dateString}</span>`
    }
  }
}
