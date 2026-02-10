// src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Update with your actual API URL
});


// 2. Request Interceptor: Attach Token ONLY for Admin/Auth endpoints
api.interceptors.request.use(
  (config) => {
    // Define which paths require authentication
    // We check if the URL starts with '/admin' OR if it is the validation endpoint
    const isProtectedEndpoint = 
        config.url?.startsWith('/admin') || 
        config.url?.includes('/validate-authentication');

    if (isProtectedEndpoint) {
        console.log("end point is protected... fetching access token");
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Handle 401 Errors (Refresh Logic)
api.interceptors.response.use(
  (response) => response, // Return success responses immediately
  async (error) => {
    console.log("Interceptor");
    const originalRequest = error.config;
    console.log(error)
    // Check if error is 401 AND it came from a protected endpoint
    // We also check !originalRequest._retry to prevent infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
        console.log("Token has expired");
      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call the refresh endpoint
        // NOTE: We use 'axios' directly here, not 'api', to avoid circular logic
        console.log("fetching refresh token");
        const response = await axios.post(`${import.meta.env.VITE_API_URL}authentication/refresh`, {
          refreshToken: refreshToken,
        });

        // Extract new tokens from the response
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // 2. Update the header of the failed request with the NEW token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // 3. Retry the original request with the new token
        return api(originalRequest);

      } catch (refreshError) {
        // If the refresh token is also invalid/expired, log the user out
        console.error("Session expired. Logging out...");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // window.location.href = '/login'; 
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;