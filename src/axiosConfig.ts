import axios, { AxiosError } from 'axios';
import Config from './config';

const config = Config.getInstance();

const axiosInstance = axios.create({
  baseURL: config.qLinkUrl || '',
  headers: {
    'Content-Type': 'application/xml'
  },
  timeout: 5000
});

const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

export { axiosInstance, isAxiosError };
