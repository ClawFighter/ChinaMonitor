// China Monitor — Health Check

const HEALTH_CHECK_TIMEOUT = 3000;
const MAX_RETRIES = 3;

export interface HealthStatus {
  news: boolean;
  weather: boolean;
  overall: boolean;
}

export async function checkHealth(): Promise<HealthStatus> {
  const status: HealthStatus = {
    news: false,
    weather: false,
    overall: false
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT);
    
    const response = await fetch('/api/news?limit=1', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    
    clearTimeout(timeoutId);
    status.news = response.ok;
  } catch (error) {
    status.news = false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT);
    
    const response = await fetch('/api/weather?limit=1', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    
    clearTimeout(timeoutId);
    status.weather = response.ok;
  } catch (error) {
    status.weather = false;
  }

  status.overall = status.news || status.weather;
  return status;
}

export function redirectToMaintenance(reason?: string): void {
  window.location.href = `/maintenance.html?reason=${reason || 'services_unavailable'}`;
}

export async function performHealthCheck(): Promise<boolean> {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      const status = await checkHealth();
      
      if (status.overall) {
        console.log('Health check passed:', status);
        return true;
      }
      
      retries++;
      await new Promise(resolve => setTimeout(resolve, 2000 * (retries + 1)));
    } catch (error) {
      retries++;
      await new Promise(resolve => setTimeout(resolve, 2000 * (retries + 1)));
    }
  }
  
  console.error('All health checks failed, redirecting to maintenance');
  redirectToMaintenance('services_unavailable');
  return false;
}
