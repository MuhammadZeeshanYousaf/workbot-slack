import axios, { AxiosError, AxiosInstance } from 'axios';
import jwt from 'jsonwebtoken';
import FormData from 'form-data';
import { STATUSCODE } from '~/globals';

export class BaseClient {
  protected axios!: AxiosInstance;

  constructor(protected baseURL: string) {
    this.axios = axios.create({ baseURL, timeout: 20 * 1000 });
  }

  protected getFormDataHeaders(formData: FormData) {
    return {
      ...formData.getHeaders(),
      'Content-Length': `${formData.getLengthSync()}`
    };
  }

  protected isAxiosError(e: AxiosError) {
    return !!e?.isAxiosError;
  }

  protected hasStatus(e: AxiosError, status: STATUSCODE) {
    return this.isAxiosError(e) && +e?.response?.status! === status;
  }
}
