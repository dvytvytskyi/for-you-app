import axios from 'axios';

// API Key та Secret для публічного доступу до properties
// Ці ключі збережені в безпечному місці (в реальному проекті - в env variables)
const API_KEY = 'fyr_44cb17e5192a0362110bbad92b49e52718b686dfd87907e685b41be0322e76cf';
const API_SECRET = '23845004e6846bdf4505f6ce5b9c1e9c53b263ca2f2f0b0829fb8b68e75c78423b762f7f7d575a90e70853a6d65b42a79fe99600fd7ec799e05478cfe35f3306';

// Backend API URL (адмін-панель)
// Public API доступний тільки на production сервері
// Використовуємо production URL для всіх запитів до public API
const API_URL = 'https://admin.foryou-realestate.com/api';

export const publicApiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
    'x-api-key': API_KEY, // Додаємо також lowercase версію для developers API
    'X-API-Secret': API_SECRET,
    'x-api-secret': API_SECRET, // Додаємо також lowercase версію для developers API
  },
});

// Request interceptor - log requests
publicApiClient.interceptors.request.use(
  async (config) => {
    console.log('🔗 Public API Request:', `${config.baseURL}${config.url}`);
    console.log('🔑 API Key present:', !!(config.headers['X-API-Key'] || config.headers['x-api-key']));
    console.log('🔐 API Secret present:', !!(config.headers['X-API-Secret'] || config.headers['x-api-secret']));
    console.log('🔑 API Key value:', (config.headers['X-API-Key'] || config.headers['x-api-key'])?.substring(0, 20) + '...');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
publicApiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Public API Response:', response.config?.url, response.status);
    return response;
  },
  async (error) => {
    try {
      const status = error.response?.status;
      const url = error.config?.url || 'unknown';
      console.error('❌ Public API Error:', status, url);
      
      if (error.response?.data) {
        try {
          const errorData = typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data, null, 2);
          console.error('Error data:', errorData);
        } catch (stringifyError) {
          console.error('Error data: [Unable to stringify]');
        }
      }
    } catch (loggingError) {
      console.error('❌ Error in error handler:', loggingError);
    }
    
    return Promise.reject(error);
  }
);
