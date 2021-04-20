import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

type ErrorData = { [k: string]: any };

export class RichAxiosError implements AxiosError {
  name: string;

  message: string;

  stack?: string;

  config: AxiosRequestConfig;

  code?: string;

  request?: any;

  response?: AxiosResponse;

  data?: ErrorData;

  constructor(error: AxiosError) {
    this.name = 'RichAxiosError';
    this.stack = error.stack;
    this.config = error.config;
    this.code = error.code;
    this.request = error.request;
    this.response = error.response;
    // Get message and payload if possible
    if (error.response && error.response.data) {
      this.message = error.response.data.message;
      this.data = error.response.data.data;
    } else {
      this.message = error.message;
    }
  }

  isAxiosError = true;

  toJSON: () => Record<string, unknown> = () => ({
    // Standard
    message: this.message,
    name: this.name,
    stack: this.stack,
    // Axios
    config: this.config,
    code: this.code,
  });
}
