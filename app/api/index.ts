import axios from 'axios';
import { useLoadingStore } from '@/store/loading';
import { useAlertStore } from '@/store/alert';

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
    const { alert } = useAlertStore();
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
    const { alert } = useAlertStore();
    alert('error', err);
  }
);

export default axiosInstance;
