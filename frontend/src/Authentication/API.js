import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5555',
    withCredentials: true,
});

// Request Interceptor: Attach access token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Refresh token on 401 responses
api.interceptors.response.use(
    (response) => response,  // Pass successful responses through
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                console.error('No refresh token available. Logging out.');
                localStorage.removeItem('token');
                window.location.href = '/';
                return Promise.reject(error);
            }

            try {
                console.log('Attempting to refresh token:', refreshToken);

                const { data } = await api.post('/refresh', { refresh_token: refreshToken });
                localStorage.setItem('token', data.access_token);
                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

                return api(originalRequest);  // Retry the original request
            } catch (refreshError) {
                console.error('Refresh token expired or invalid. Logging out.');
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
