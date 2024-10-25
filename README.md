
# Example Usage

Here’s an example of how to use the `qlink-client-lib` to send a request to the QLink API and handle errors.

## Prerequisites
Make sure you have the required environment variables configured in a `.env` file:

```bash
Q_LINK_USER=yourUsername
Q_LINK_PASSWORD=yourPassword
Q_LINK_URL=https://govtest.qlink.co.za/cgi-bin/XmlProc
```

## Step-by-step example

```ts
import { QLinkRequest } from './types';  // Import the main types
import { sendQLinkRequest } from './services/qlinkService';  // Import the service for sending the request
import { QLinkError } from './errors';  // Import custom error for handling specific errors

// Function to send a QLink request
const callSendQLinkRequest = async () => {
  try {
    // Create the header for the QLink request
    const header = {
      transactionType: 6,  // Transaction type
      paymentType: 1,      // Payment type
      institution: 9999,   // Your institution ID
      username: process.env.Q_LINK_USER || 'defaultUser',  // Username from environment
      password: process.env.Q_LINK_PASSWORD || 'defaultPassword',  // Password from environment
      key: "",  // Optional key
    };

    // Create the payload for the QLink request
    const payload = {
      field1: 'Example Value 1',
      field2: 1000,
    };

    // Combine the header and payload into a QLinkRequest object
    const request: QLinkRequest = {
      header,
      data: payload,
    };

    // Send the request using the qlink-client-lib
    await sendQLinkRequest(request);

    // If the request completes successfully
    console.log('Request completed successfully.');

  } catch (error) {
    // Handle any errors that occur during the request
    if (error instanceof QLinkError) {
      // Handle QLink-specific errors or HTTP errors
      console.error(`Error occurred: ${error.message} (Status: ${error.statusCode})`);
    } else {
      // Handle unexpected errors
      console.error('An unexpected error occurred:', error);
    }
  }
};

// Call the function to send the request
callSendQLinkRequest();
```

### Explanation

- QLinkRequest: The request is composed of a header and data payload, and you can customize these values as needed.
- Environment Variables: The environment variables for the QLink API (Q_LINK_USER, Q_LINK_PASSWORD, Q_LINK_URL) are loaded from a .env file. Ensure you have set these values in your project.
- Error Handling: The example uses try/catch to handle:
- QLink-specific errors: If there is a problem with the request (e.g., wrong credentials, malformed data), a QLinkError is thrown with details of the error.
- HTTP errors: Errors related to the HTTP request (e.g., timeouts, server errors) are also caught and rethrown as QLinkError.
- Unexpected errors: Any unforeseen errors are caught and logged.


# A note on modelling

1.	**Human-readable models are first-class citizens** in the code. These models are used throughout the business logic.
2.	**Serialization is explicit:** The transformation to QLink’s DSL happens at the serialization stage, right before sending the request.
3.	**Core models stay readable:** Developers interact with institution, transactionType, etc., rather than dealing with QLink’s abbreviations.
4.	**Separation of concerns:** Business logic, core models, and serialization logic are separated, making the codebase easier to understand and maintain.

always use axiosConfig instead of axios directly.

# Development Environment Setup

```bash
# confirm your public IP from your NAT gateway is registered with QLink.
curl ifconfig.me
```

```bash
curl -o setup-remote-env.sh https://raw.githubusercontent.com/RootBank/qlink-xml-client/refs/heads/main/setup-remote-env.sh

chmod +x setup-remote-env.sh
sudo ./setup-remote-env.sh
```

```bash
# $ cat ~/.ssh/config
# ...other configs...

Host sandbox-dev
    HostName <ip address> # from private subnet
    User ec2-user
    #IdentityFile ~/.ssh/keypair.pem
    IdentityFile ~/.ssh/id_ed25519
    ProxyJump sandbox-jumphost

Host sandbox-jumphost
    HostName <ip address> # from public subnet
    User ec2-user
    #IdentityFile ~/.ssh/keypair.pem
    IdentityFile ~/.ssh/id_ed25519
    ForwardAgent yes
```
