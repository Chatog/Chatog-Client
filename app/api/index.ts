import axios from 'axios';
import { showLoading, hideLoading } from '@/store/loading';
import { alert } from '@/store/alert';
import jwtDecode from 'jwt-decode';
import { selfMemberId, useRoomStore } from '@/store/room';

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
      // save memberId
      selfMemberId(jwtDecode<{ sub: string }>(token).sub);
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
    alert('error', err);
  }
);

// handle Res
axiosInstance.interceptors.response.use(
  (res) => {
    const r = res.data;
    if (r.code === 1) {
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
