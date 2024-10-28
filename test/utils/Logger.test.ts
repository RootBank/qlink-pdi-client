import { Logger, LogLevel } from '../../src/utils/Logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('#log', () => {
    it('should log a message when message level meets the log level threshold', async () => {
      logger = new Logger(LogLevel.INFO);
      await logger.log(LogLevel.INFO, 'Info message');
      expect(consoleSpy).toHaveBeenCalledWith('[INFO]: Info message');
    });

    it('should not log a message when message level is below the log level threshold', async () => {
      logger = new Logger(LogLevel.INFO);
      await logger.log(LogLevel.DEBUG, 'Debug message');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should include details if provided as an object', async () => {
      logger = new Logger(LogLevel.DEBUG);
      await logger.log(LogLevel.ERROR, 'Error occurred', { errorCode: 500 });
      expect(consoleSpy).toHaveBeenCalledWith(
        '[ERROR]: Error occurred | Details: {"errorCode":500}'
      );
    });

    it('should include details if provided as a string', async () => {
      logger = new Logger(LogLevel.INFO);
      await logger.log(LogLevel.ERROR, 'Error occurred', 'Some details');
      expect(consoleSpy).toHaveBeenCalledWith(
        '[ERROR]: Error occurred | Details: Some details'
      );
    });

    it('should handle logging without details', async () => {
      logger = new Logger(LogLevel.INFO);
      await logger.log(LogLevel.INFO, 'No details message');
      expect(consoleSpy).toHaveBeenCalledWith('[INFO]: No details message');
    });
  });

  describe('#debug', () => {
    it('should log debug messages when log level is DEBUG', async () => {
      logger = new Logger(LogLevel.DEBUG);
      logger.debug('Debugging message');
      expect(consoleSpy).toHaveBeenCalledWith('[DEBUG]: Debugging message');
    });

    it('should not log debug messages when log level is higher than DEBUG', async () => {
      logger = new Logger(LogLevel.INFO);
      logger.debug('Debugging message');
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('#info', () => {
    it('should log info messages when log level is INFO or lower', async () => {
      logger = new Logger(LogLevel.INFO);
      logger.info('Information message');
      expect(consoleSpy).toHaveBeenCalledWith('[INFO]: Information message');
    });

    it('should not log info messages when log level is higher than INFO', async () => {
      logger = new Logger(LogLevel.ERROR);
      logger.info('Information message');
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('#error', () => {
    it('should always log error messages regardless of log level', async () => {
      logger = new Logger(LogLevel.ERROR);
      logger.error('Error message');
      expect(consoleSpy).toHaveBeenCalledWith('[ERROR]: Error message');
    });

    it('should log error messages with details', async () => {
      logger = new Logger(LogLevel.ERROR);
      logger.error('Error with details', { errorCode: 404 });
      expect(consoleSpy).toHaveBeenCalledWith(
        '[ERROR]: Error with details | Details: {"errorCode":404}'
      );
    });
  });
});
