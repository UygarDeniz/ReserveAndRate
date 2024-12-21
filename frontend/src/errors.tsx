export class APIError extends Error {
  data: { [key: string]: string[] };
  constructor(message: string, data: { [key: string]: string[] }) {
    super(message);
    this.name = 'APIError';
    this.data = data;
  }
}


