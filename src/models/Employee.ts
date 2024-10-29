import { EmployeeFields } from '../types';
import { Connection } from './Connection';
import { QLinkError } from '../errors';
import { Logger } from '../utils/Logger';
import Config from '../config';
import { serializeEmployeeToXML } from '../serialization/EmployeeSerializer';
import { parseEmployeeFromXML } from '../serialization/EmployeeParser';

const config = Config.getInstance();
const logger = new Logger(config.logLevel);

export class Employee {
  private connection: Connection;
  public fields: Partial<EmployeeFields>;

  constructor(connection: Connection, fields: Partial<EmployeeFields> = {}) {
    this.connection = connection;
    this.fields = fields;
  }

  setField<K extends keyof EmployeeFields>(key: K, value: EmployeeFields[K]) {
    this.fields[key] = value;
  }

  validate(): void {
    if (!this.fields.employeeNumber) {
      throw new QLinkError('Employee Number is required');
    }
  }

  toXML(): string {
    this.validate();
    return serializeEmployeeToXML(this.fields as EmployeeFields);
  }

  async find(): Promise<Employee> {
    const requestData = {
      header: this.connection.connectionConfig,
      data: this
    };

    logger.debug(
      `Find employee with request data: ${JSON.stringify(requestData)}`
    );
    const responseXML = await this.connection.sendRequest(requestData);
    logger.debug(
      `Found employe with response data: ${JSON.stringify(responseXML)}`
    );
    return parseEmployeeFromXML(this.connection, responseXML);
  }
}
