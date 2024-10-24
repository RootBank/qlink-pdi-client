import { axiosInstance, isAxiosError } from '../axiosConfig';
import {
  serializeToQLinkFormat,
  convertToXML,
  convertBulkToXML,
  convertInsurancePayrollBulkToXML
} from '../serialization';
import {
  QLinkRequest,
  BulkQLinkRequest,
  BulkInsurancePayrollDeductionRequest
} from '../types';
import { QLinkError } from '../errors';

const handleQLinkResponseErrors = (responseData: string): void => {
  if (responseData.includes('<ERR_CODE>')) {
    const errCode = responseData.match(/<ERR_CODE>(\d+)<\/ERR_CODE>/)?.[1];
    const errMsg = responseData.match(/<ERR_MSG>(.*?)<\/ERR_MSG>/)?.[1];
    throw new QLinkError(
      `QLink API error: ${errMsg || 'Unknown error'}`,
      Number(errCode)
    );
  }
};

const handleExceptions = (error: any): void => {
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    const message = error.response?.data || error.message;
    throw new QLinkError(`HTTP error: ${message}`, statusCode);
  } else if (error instanceof QLinkError) {
    console.error(
      `QLink Error: ${error.message}, Status Code: ${error.statusCode}`
    );
    throw error;
  } else {
    console.error('Unexpected error:', error);
    throw new QLinkError('Unexpected error occurred', 500);
  }
};

export const sendQLinkRequest = async (
  request: QLinkRequest
): Promise<void> => {
  const serializedRequest = serializeToQLinkFormat(request);
  const xmlData = convertToXML(serializedRequest);

  try {
    const response = await axiosInstance.post('', xmlData);
    handleQLinkResponseErrors(response.data);
  } catch (error: any) {
    handleExceptions(error);
  }
};

export const sendBulkQLinkRequest = async (
  request: BulkQLinkRequest
): Promise<void> => {
  const xmlData = convertBulkToXML(request);

  try {
    const response = await axiosInstance.post('', xmlData);
    handleQLinkResponseErrors(response.data);
  } catch (error: any) {
    handleExceptions(error);
  }
};

export const sendBulkInsurancePayrollDeductionRequest = async (
  request: BulkInsurancePayrollDeductionRequest
): Promise<void> => {
  const xmlData = convertInsurancePayrollBulkToXML(request);

  try {
    const response = await axiosInstance.post('', xmlData);
    handleQLinkResponseErrors(response.data);
  } catch (error: any) {
    handleExceptions(error);
  }
};
