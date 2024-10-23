import { QLinkClient } from './client';
import { QLinkError } from './errors';

const client = new QLinkClient(
  'testUser',
  'testPassword',
  'https://govtest.qlink.co.za/cgi-bin/XmlProc'
);

const xmlRequest = `
    <QLINK>
        <HDR>
            <TRX>6</TRX>
            <INST>9999</INST>
            <PAY>1</PAY>
            <USER>testUser</USER>
            <PSWD>testPassword</PSWD>
        </HDR>
    </QLINK>
`;

client
  .sendXmlTransaction(xmlRequest)
  .then(response => console.log('Response:', response))
  .catch((error: QLinkError) => {
    console.error(`Error: ${error.message}, Status Code: ${error.statusCode}`);
  });
