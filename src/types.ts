// Header Model (main logical entity)
export interface Header {
  transactionType: number;
  paymentType: number;
  institution: number;
  username: string;
  password: string;
  key?: string;
}

// Payload Model (main logical entity)
export interface Payload {
  [key: string]: string | number;  // Arbitrary key-value pairs for payload
}

// Main QLink Request Model (main logical entity)
export interface QLinkRequest {
  header: Header;
  data: Payload;
}