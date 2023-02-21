import axios from 'axios';
import { showLoading, hideLoading } from '@/store/loading';
import { alert } from '@/store/alert';

import PROD_CONFIG from '@/configs/prod-config';

export enum ResCode {
  SUCCESS = 0,
  ERROR_MSG = 1
}

export interface Res<T> {
  code: ResCode;
  msg: string;
  data: T;
}

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? '/api'
      : `https://${PROD_CONFIG.SERVER_HOST}`
});

/**
 * show loading when request
 */
axiosInstance.interceptors.request.use(
  (config) => {
    showLoading();
    return config;
  },
  (err) => {
    alert('error', err);
  }
);
axiosInstance.interceptors.response.use(
  (res) => {
    hideLoading();
    return res;
  },
  (err) => {
    hideLoading();
    alert('error', err);
  }
);

// handle Res
axiosInstance.interceptors.response.use(
  (res) => {
    const r = res.data;
    if (r.code === ResCode.ERROR_MSG) {
      alert('error', r.msg);
      throw new Error(`[api/index.ts] request error: ${r.msg}}`);
    }
    return r;
  },
  (err) => {
    alert('error', err);
  }
);

export default axiosInstance;
