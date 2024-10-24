import axios from 'axios';
import { js2xml } from 'xml-js';
import { serializeToQLinkFormat } from '../serialization';
import { QLinkRequest } from '../types';
import { QLinkError } from '../errors';

// QLink-specific request format
interface QLinkSerializedRequest {
  HDR: object;
  DATA: object;
}

// Convert the serialized request to XML format
const convertToXML = (request: QLinkSerializedRequest): string => {
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  // Wrap the HDR and DATA sections inside the QLINK root element
  const qlinkWrappedRequest = {
    QLINK: request
  };

  return js2xml(qlinkWrappedRequest, options);
};

// Function to send the request
export const sendQLinkRequest = async (
  request: QLinkRequest
): Promise<void> => {
  const serializedRequest = serializeToQLinkFormat(request);
  const xmlData = convertToXML(serializedRequest);

  try {
    // Send the request to the QLink API
    console.log('Q_LINK_URL:', process.env.Q_LINK_URL);
    const response = await axios.post(process.env.Q_LINK_URL || '', xmlData, {
      headers: {
        'Content-Type': 'application/xml'
      }
    });

    // Check if the response contains an error code (from the XML response)
    const responseData = response.data;
    console.log(responseData);
    if (responseData.includes('<ERR_CODE>')) {
      const errCode = responseData.match(/<ERR_CODE>(\d+)<\/ERR_CODE>/)?.[1];
      const errMsg = responseData.match(/<ERR_MSG>(.*?)<\/ERR_MSG>/)?.[1];
      throw new QLinkError(
        `QLink API error: ${errMsg || 'Unknown error'}`,
        Number(errCode)
      );
    }

    console.log('Response:', response.data);
  } catch (error: any) {
    // Handle HTTP errors or QLink-specific errors
    if (axios.isAxiosError(error)) {
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
  }
};
