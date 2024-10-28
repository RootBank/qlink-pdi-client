// test/errors/QLinkError.test.ts
import { QLinkError } from '../src/errors';

describe('QLinkError', () => {
  it('should create an instance of QLinkError with a message', () => {
    const errorMessage = 'An error occurred';
    const error = new QLinkError(errorMessage);

    expect(error).toBeInstanceOf(QLinkError);
    expect(error.message).toBe(errorMessage);
    expect(error.name).toBe('QLinkError');
    expect(error.statusCode).toBeUndefined();  // Status code should be undefined if not provided
  });

  it('should create an instance of QLinkError with a message and status code', () => {
    const errorMessage = 'An error occurred';
    const statusCode = 400;
    const error = new QLinkError(errorMessage, statusCode);

    expect(error).toBeInstanceOf(QLinkError);
    expect(error.message).toBe(errorMessage);
    expect(error.name).toBe('QLinkError');
    expect(error.statusCode).toBe(statusCode);
  });

  it('should inherit from the base Error class', () => {
    const errorMessage = 'An error occurred';
    const error = new QLinkError(errorMessage);

    expect(error).toBeInstanceOf(Error);
  });

  it('should have correct prototype set to QLinkError', () => {
    const errorMessage = 'An error occurred';
    const error = new QLinkError(errorMessage);

    // Check that the prototype is set correctly
    expect(Object.getPrototypeOf(error)).toBe(QLinkError.prototype);
  });

  it('should handle undefined status code gracefully', () => {
    const error = new QLinkError('Error with undefined status code');

    expect(error.statusCode).toBeUndefined();
  });

  it('should set default name property to "QLinkError"', () => {
    const error = new QLinkError('Default name check');

    expect(error.name).toBe('QLinkError');
  });
});
