import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// API Key та Secret для публічного доступу до properties
// Ці ключі збережені в безпечному місці (в реальному проекті - в env variables)
const API_KEY = 'fyr_44cb17e5192a0362110bbad92b49e52718b686dfd87907e685b41be0322e76cf';
const API_SECRET = '23845004e6846bdf4505f6ce5b9c1e9c53b263ca2f2f0b0829fb8b68e75c78423b762f7f7d575a90e70853a6d65b42a79fe99600fd7ec799e05478cfe35f3306';

// Backend API URL (адмін-панель)
// Public API доступний тільки на production сервері
// Використовуємо production URL для всіх запитів до public API
const API_URL = 'https://admin.foryou-realestate.com/api/v1';

export const publicApiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
    'X-API-Secret': API_SECRET,
    'User-Agent': 'ForYou-Mobile-App/1.0.0',
  },
});

// Request interceptor - log requests and add auth token if available
publicApiClient.interceptors.request.use(
  async (config) => {
    // Також намагаємося додати токен авторизації, щоб бекенд міг повернути userProgress
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('🔗 Public API Request:', `${config.baseURL}${config.url}`);
    console.log('🔑 API Key present:', !!(config.headers['X-API-Key'] || config.headers['x-api-key']));
    console.log('🔐 API Secret present:', !!(config.headers['X-API-Secret'] || config.headers['x-api-secret']));
    console.log('🔑 Token present:', !!token);
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
          const isHtml = typeof error.response.data === 'string' && error.response.data.includes('<html');
          if (isHtml) {
            console.warn('📋 Error data: [HTML/Error Page]');
          } else {
            const errorData = typeof error.response.data === 'string'
              ? error.response.data
              : JSON.stringify(error.response.data, null, 2);
            console.warn('📋 Error data:', errorData);
          }
        } catch (stringifyError) {
          console.warn('📋 Error data: [Unable to stringify]');
        }
      }
    } catch (loggingError) {
      console.error('❌ Error in error handler:', loggingError);
    }

    return Promise.reject(error);
  }
);
