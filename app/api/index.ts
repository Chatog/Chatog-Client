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
    return res.data;
  },
  (err) => {
    alert('error', err);
  }
);

export default axiosInstance;
