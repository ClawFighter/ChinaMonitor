// China Monitor — YouTube Player

export class YouTubePlayer {
  private iframe: HTMLIFrameElement | null = null;
  private readonly videoId = 'BOy2xDU1LC8';

  constructor() {
    this.iframe = document.getElementById('youtube-player') as HTMLIFrameElement;
  }

  init(): void {
    if (!this.iframe) {
      console.error('YouTube iframe element not found');
      return;
    }

    // Set YouTube embed URL with autoplay and loop
    const embedUrl = `https://www.youtube.com/embed/${this.videoId}?autoplay=1&mute=1&loop=1&playlist=${this.videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1`;
    
    console.log('Setting YouTube iframe src:', embedUrl);
    this.iframe.src = embedUrl;
    this.iframe.title = 'Live YouTube Stream';
    this.iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen');
    this.iframe.setAttribute('allowfullscreen', 'true');
    
    // Force reload
    this.iframe.onload = () => {
      console.log('YouTube iframe loaded');
    };
    
    console.log(`YouTube player initialized: ${this.videoId}`);
  }
}
