import { QLinkRequest, Header, Payload } from './types';
import { sendQLinkRequest } from './services/qlinkService';

// Define the human-readable request
const header: Header = {
  transactionType: 6,
  paymentType: 1,
  institution: 9999,
  username: process.env.Q_LINK_USER || "testUser",
  password: process.env.Q_LINK_PASSWORD || "testPassword",
  key: "",
};

const payload: Payload = {
  someField: "Some value",
  anotherField: 42,
};

const request: QLinkRequest = {
  header,
  data: payload,
};

// Send the request using the service
sendQLinkRequest(request);
