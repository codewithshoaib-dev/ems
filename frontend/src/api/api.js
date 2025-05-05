import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('AccessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let IsRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (IsRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            IsRefreshing = true;

            const refreshToken = localStorage.getItem('RefreshToken');

            return new Promise((resolve, reject) => {
                api.post(import.meta.env.VITE_REFRESH_URL, {'refresh': refreshToken })
                    .then(({ data }) => {
                        const newAccessToken = data.access;
                        console.log(newAccessToken)
                        localStorage.setItem('AccessToken', newAccessToken);
                        api.defaults.headers['Authorization'] = 'Bearer ' + newAccessToken;
                        processQueue(null, newAccessToken);
                        resolve(api(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err, null);
                        reject(err);
                    })
                    .finally(() => {
                        IsRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

export default api;
