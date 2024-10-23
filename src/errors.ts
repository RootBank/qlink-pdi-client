export class QLinkError extends Error {
  public statusCode?: number; // Optional, if you want to include status codes or any other metadata

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'QLinkError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, QLinkError.prototype);
  }
}
