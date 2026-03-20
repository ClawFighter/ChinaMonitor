// China Monitor — API Client

const API_BASE = '';

export const apiClient = {
  async get(endpoint: string): Promise<any> {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
};
