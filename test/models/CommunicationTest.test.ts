import { CommunicationTest } from '../../src/models/CommunicationTest';
import { QlinkClient } from '../../src/models/qlink-client';
import { Logger } from '../../src/utils/Logger';
import Config from '../../src/config';
import { TransactionType } from '../../src/enums/TransactionType';
import { PayrollIdentifier } from '../../src/enums/PayrollIdentifier';

jest.mock('../../src/config', () => ({
  getInstance: jest.fn().mockReturnValue({
    qLinkUrl: 'https://test.url',
    qLinkUser: 'testUser',
    qLinkPassword: 'testPassword',
    institutionId: 9999,
    logLevel: 2 // LogLevel.ERROR as default
  })
}));
jest.mock('../../src/utils/Logger');
jest.mock('../../src/models/qlink-client');

describe('CommunicationTest', () => {
  let communicationTest: CommunicationTest;
  let connection: QlinkClient;

  beforeEach(() => {
    Config.getInstance = jest.fn().mockReturnValue({
      qLinkUrl: 'https://test.url',
      qLinkUser: 'testUser',
      qLinkPassword: 'testPassword',
      logLevel: '2',
      institutionId: 9999
    });
    connection = new QlinkClient({ transaction_type: TransactionType.COMMUNICATION_TEST, institution: 9999, payrollIdentifier: PayrollIdentifier.PERSAL, username: 'testUser', password: 'testPassword', effectiveSalaryMonth: '202301' });
    communicationTest = new CommunicationTest(connection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#toXML', () => {
    it('returns an empty string for now (can be updated for XML generation)', () => {
      const xml = communicationTest.toXML();
      expect(xml).toBe('');
    });
  });

  describe('#save', () => {
    it('logs the request data and calls sendRequest on the connection', async () => {
      const mockLogger = jest.spyOn(Logger.prototype, 'debug');
      const mockSendRequest = jest.spyOn(connection, 'sendRequest').mockResolvedValue('<QLINK><SRC_IP>164.147.0.25</SRC_IP><MSG>WELCOME TO THE QLINK XML TRANSACTION SERVER</MSG></QLINK>');

      await communicationTest.save();

      const expectedRequestData = {
        header: connection.connectionConfig,
        data: communicationTest
      };

      expect(mockLogger).toHaveBeenCalledWith(`Communication Test with request data: ${JSON.stringify(expectedRequestData)}`);
      expect(mockSendRequest).toHaveBeenCalledWith(expectedRequestData);
    });

    it('handles response from sendRequest correctly', async () => {
      const mockSendRequest = jest.spyOn(connection, 'sendRequest').mockResolvedValue('<QLINK><SRC_IP>164.147.0.25</SRC_IP><MSG>WELCOME TO THE QLINK XML TRANSACTION SERVER</MSG></QLINK>');

      await expect(communicationTest.save()).resolves.not.toThrow();
      expect(mockSendRequest).toHaveBeenCalled();
    });
  });
});
