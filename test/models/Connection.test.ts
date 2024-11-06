import { QlinkClient } from '../../src/models/qlink-client';
import { QLinkError } from '../../src/errors';
import { axiosInstance } from '../../src/axiosConfig';
import { TransactionType } from '../../src/enums/TransactionType';
import { QLinkRequest, BulkQLinkRequest, ConfigFields } from '../../src/types';
import { Logger } from '../../src/utils/Logger';
import Config from '../../src/config';
import { PayrollIdentifier } from '../../src/enums/PayrollIdentifier';
import { getFutureEffectiveSalaryMonth } from '../testHelpers'

jest.mock('../../src/axiosConfig');
jest.mock('../../src/utils/Logger');

describe('QlinkClient', () => {
  let connection: QlinkClient;
  let mockConfig: ConfigFields;

  beforeEach(() => {
    mockConfig = {
      transaction_type: TransactionType.Q_LINK_TRANSACTIONS,
      institution: 1,
      payrollIdentifier: PayrollIdentifier.PERSAL,
      username: 'testUser',
      password: 'testPassword',
      effectiveSalaryMonth: getFutureEffectiveSalaryMonth(),
    };

    connection = new QlinkClient(mockConfig);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize and validate the connection config', () => {
      const loggerMock = jest.spyOn(Logger.prototype, 'debug');
      new QlinkClient(mockConfig);
      expect(loggerMock).toHaveBeenCalledWith('Validating connection configuration');
    });
  });

  describe('sendRequest', () => {
    it('should send a request and return the response data', async () => {
      const requestData: QLinkRequest<any> = {
        header: connection.connectionConfig,
        data: { toXML: () => '<DATA><TEST>VALUE</TEST></DATA>' },
      };
      const responseData = '<QLINK><DATA><RESPONSE>SUCCESS</RESPONSE></DATA></QLINK>';

      (axiosInstance.post as jest.Mock).mockResolvedValue({ data: responseData });

      const result = await connection.sendRequest(requestData);
      expect(result).toBe(responseData);
    });

    it('should throw QLinkError if response contains an error code', async () => {
      const requestData: QLinkRequest<any> = {
        header: connection.connectionConfig,
        data: { toXML: () => '<DATA><TEST>VALUE</TEST></DATA>' },
      };
      const errorResponseData = '<QLINK><DATA><ERR_CODE>1234</ERR_CODE></DATA></QLINK>';

      (axiosInstance.post as jest.Mock).mockResolvedValue({ data: errorResponseData });

      await expect(connection.sendRequest(requestData)).rejects.toThrow(QLinkError);
      expect(Logger.prototype.error).toHaveBeenCalledWith(expect.stringContaining('QLink API error'));
    });
  });

  describe('handleQLinkResponseErrors', () => {
    it('should throw QLinkError if ERR_CODE is found in the response', () => {
      const errorResponseData = '<QLINK><DATA><ERR_CODE>1234</ERR_CODE><ERR_MSG>Test Error</ERR_MSG></DATA></QLINK>';
      expect(() => connection['handleQLinkResponseErrors'](errorResponseData)).toThrow(QLinkError);
    });
  });

  describe('handleExceptions', () => {
    xit('should log and throw QLinkError for HTTP errors', () => {
      const error = { response: { status: 400, data: 'Bad Request' }, message: 'HTTP Error' };
      (Logger.prototype.error as jest.Mock).mockClear();

      expect(() => connection['handleExceptions'](error)).toThrow(QLinkError);
      expect(Logger.prototype.error).toHaveBeenCalledWith(expect.stringContaining('HTTP error occurred'));
    });

    xit('should log and throw QLinkError for unexpected errors', () => {
      const error = new Error('Unexpected Error');
      expect(() => connection['handleExceptions'](error)).toThrow(QLinkError);
      expect(Logger.prototype.error).toHaveBeenCalledWith(expect.stringContaining('Unexpected error:'));
    });
  });
});
