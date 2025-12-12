import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Локальний бекенд API URL (для leads та інших endpoints)
// Для локальної розробки використовуємо локальний backend
// Для iOS симулятора використовуємо localhost (симулятор має доступ до localhost комп'ютера)
const BACKEND_API_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1'
  : 'https://admin.foryou-realestate.com/api/v1';

export const backendApiClient = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
backendApiClient.interceptors.request.use(
  async (config) => {
    // Використовуємо той самий токен з адмін-панелі
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Логування для діагностики
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('🔗 Backend API Request:', fullUrl);
    console.log('📋 Method:', config.method?.toUpperCase());
    console.log('🔑 Token present:', !!token);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
backendApiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Backend API Response:', response.config?.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Безпечне логування помилок
    try {
      if (error.response) {
        const status = error.response.status;
        const url = error.config?.url || 'unknown';
        const fullUrl = error.config?.baseURL 
          ? `${error.config.baseURL}${url}` 
          : url;
        
        console.error('❌ Backend API Error:', status);
        console.error('📄 Request URL:', url);
        console.error('🌐 Full URL:', fullUrl);
        
        // Безпечне логування response data
        if (error.response.data) {
          try {
            const responseData = typeof error.response.data === 'string'
              ? error.response.data
              : JSON.stringify(error.response.data, null, 2);
            console.error('📋 Response data:', responseData);
          } catch (stringifyError) {
            console.error('📋 Response data: [Unable to stringify]');
          }
        }
      } else if (error.request) {
        console.error('❌ No response received:', error.config?.url || 'unknown');
      } else {
        console.error('❌ Error setting up request:', error.message || 'Unknown error');
      }
    } catch (loggingError) {
      // Якщо навіть логування викликає помилку, просто ігноруємо
      console.error('❌ Error in error handler:', loggingError);
    }

    // If 401 and not already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Перенаправляємо на логін, якщо токен невалідний
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
      } catch (storeError) {
        console.error('❌ Error clearing tokens:', storeError);
      }
      
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
