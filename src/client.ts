import axios from 'axios';
import { QLinkError } from './errors';

export class QLinkClient {
  private username: string;
  private password: string;
  private baseUrl: string;

  constructor(username: string, password: string, baseUrl: string) {
    this.username = username;
    this.password = password;
    this.baseUrl = baseUrl;
  }

  public async sendXmlTransaction(xmlPayload: string): Promise<any> {
    try {
      const response = await axios.post(this.baseUrl, xmlPayload, {
        headers: { 'Content-Type': 'text/xml' }
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        throw new QLinkError(
          `Failed to send XML: ${error.message}`,
          statusCode
        );
      } else {
        throw new QLinkError('Failed to send XML: An unknown error occurred.');
      }
    }
  }
}
