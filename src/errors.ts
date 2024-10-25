export class QLinkError extends Error {
  public statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'QLinkError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, QLinkError.prototype);
  }
}
