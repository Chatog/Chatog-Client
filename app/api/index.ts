import axios from 'axios';
import { useLoadingStore } from '@/store/loading';
import { alert } from '@/store/alert';

export interface Res<T> {
  code: number;
  msg: string;
  data: T;
}

const axiosInstance = axios.create({
  baseURL: '/api'
});

/**
 * save and take token
 */
let token: string | null = null;
axiosInstance.interceptors.response.use((res) => {
  if (res.headers) {
    // axios will change header name to lowercase
    const tokenFromHeader = res.headers['set-auth'];
    if (tokenFromHeader) {
      token = tokenFromHeader;
      console.log('[api/index.ts] token:', token);
    }
  }
  return res;
});
axiosInstance.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {};
  if (token) config.headers['auth'] = token;
  return config;
});

/**
 * show loading when request
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const { showLoading } = useLoadingStore();
    showLoading();
    return config;
  },
  (err) => {
    alert('error', err);
  }
);
axiosInstance.interceptors.response.use(
  (res) => {
    const { hideLoading } = useLoadingStore();
    hideLoading();
    // extract response data
    return res.data;
  },
  (err) => {
    alert('error', err);
  }
);

export default axiosInstance;
