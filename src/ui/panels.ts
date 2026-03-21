// China Monitor — Panel Manager

export class PanelManager {
  private panelContainer: HTMLElement | null = null

  init(): void {
    this.panelContainer = document.getElementById('panel-container')
  }

  addPanel(panelId: string, content: string): void {
    if (!this.panelContainer) return

    const panel = document.createElement('div')
    panel.id = panelId
    panel.className = 'panel'
    panel.innerHTML = content

    this.panelContainer.appendChild(panel)
  }

  removePanel(panelId: string): void {
    const panel = document.getElementById(panelId)
    panel?.remove()
  }
}
