import * as fs from 'fs';

interface HeaderRecord {
  fileType: string;
  clientIdentifier1: string;
  payrollIdentifier: string;
  layoutIdentifier: string;
  layoutRevision: string;
  sequenceNumber: string;
  creationDate: string;
  salaryMonth: string;
  clientIdentifier2: string;
}

interface TransactionRecord {
  transactionType: string;
  employeeNumber: string;
  surname: string;
  initials: string;
  idNumber: string;
  referenceNumber: string;
  subReference: string;
  amount: number;
  balance: number;
  arrears: number;
  subsidy: number;
  balanceOfSubsidy: number;
  salaryNotch: number;
  salaryNotchDate: string;
  newSalaryNotch: number;
  newSalaryNotchDate: string;
  startDate: string;
  endDate: string;
  deductionType: string;
  flag: string;
  appointmentCode: string;
  location: string;
  branchCode: string;
}

interface TrailerRecord {
  identifier: string;
  recordCount: number;
  checkTotal: number;
  amountTotal: number;
  balanceTotal: number;
  arrearsTotal: number;
}

export class SpotFileParser {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  public parse(): { header: HeaderRecord; transactions: TransactionRecord[]; trailer: TrailerRecord } {
    const fileContent = fs.readFileSync(this.filePath, 'utf-8');
    const lines = fileContent.trim().split('\n');

    const header = this.parseHeader(lines[0]);
    const transactions = lines.slice(1, -1).map(line => this.parseTransaction(line));
    const trailer = this.parseTrailer(lines[lines.length - 1]);

    return { header, transactions, trailer };
  }

  public serialize({ header, transactions, trailer }: { header: HeaderRecord; transactions: TransactionRecord[]; trailer: TrailerRecord }): string {
    const headerString = `${header.fileType.padEnd(4)}${header.clientIdentifier1.padEnd(4)}${header.payrollIdentifier.padEnd(4)}${header.layoutIdentifier.padEnd(4)}${header.layoutRevision.padEnd(3)}${header.sequenceNumber.padEnd(4)}${header.creationDate.padEnd(8)}${header.salaryMonth.padEnd(6)}${header.clientIdentifier2.padEnd(8)}`;

    const transactionStrings = transactions.map(transaction =>
      `${transaction.transactionType.padEnd(4)}${transaction.employeeNumber.padEnd(15)}${transaction.surname.padEnd(25)}${transaction.initials.padEnd(8)}${transaction.idNumber.padEnd(13)}${transaction.referenceNumber.padEnd(30)}${transaction.subReference.padEnd(10)}${String(transaction.amount).padStart(10, '0')}${String(transaction.balance).padStart(10, '0')}${String(transaction.arrears).padStart(10, '0')}${String(transaction.subsidy).padStart(10, '0')}${String(transaction.balanceOfSubsidy).padStart(10, '0')}${String(transaction.salaryNotch).padStart(10, '0')}${transaction.salaryNotchDate.padEnd(8)}${String(transaction.newSalaryNotch).padStart(10, '0')}${transaction.newSalaryNotchDate.padEnd(8)}${transaction.startDate.padEnd(8)}${transaction.endDate.padEnd(8)}${transaction.deductionType.padEnd(4)}${transaction.flag.padEnd(1)}${transaction.appointmentCode.padEnd(8)}${transaction.location.padEnd(30)}${transaction.branchCode.padEnd(8)}`
    );

    const trailerString = `${trailer.identifier.padEnd(4)}${String(trailer.recordCount).padStart(10, '0')}${String(trailer.checkTotal).padStart(20, '0')}${String(trailer.amountTotal).padStart(20, '0')}${String(trailer.balanceTotal).padStart(20, '0')}${String(trailer.arrearsTotal).padStart(20, '0')}`;

    return `${headerString}\n${transactionStrings.join('\n')}\n${trailerString}`;
  }

  private parseHeader(line: string): HeaderRecord {
    return {
      fileType: line.slice(0, 4).trim(),
      clientIdentifier1: line.slice(4, 8).trim(),
      payrollIdentifier: line.slice(8, 12).trim(),
      layoutIdentifier: line.slice(12, 16).trim(),
      layoutRevision: line.slice(16, 19).trim(),
      sequenceNumber: line.slice(19, 23).trim(),
      creationDate: line.slice(23, 31).trim(),
      salaryMonth: line.slice(31, 37).trim(),
      clientIdentifier2: line.slice(37, 45).trim(),
    };
  }

  private parseTransaction(line: string): TransactionRecord {
    return {
      transactionType: line.slice(0, 4).trim(),
      employeeNumber: line.slice(4, 19).trim(),
      surname: line.slice(19, 44).trim(),
      initials: line.slice(44, 52).trim(),
      idNumber: line.slice(52, 65).trim(),
      referenceNumber: line.slice(65, 95).trim(),
      subReference: line.slice(95, 105).trim(),
      amount: parseInt(line.slice(105, 115).trim(), 10) || 0,
      balance: parseInt(line.slice(115, 125).trim(), 10) || 0,
      arrears: parseInt(line.slice(125, 135).trim(), 10) || 0,
      subsidy: parseInt(line.slice(135, 145).trim(), 10) || 0,
      balanceOfSubsidy: parseInt(line.slice(145, 155).trim(), 10) || 0,
      salaryNotch: parseInt(line.slice(155, 165).trim(), 10) || 0,
      salaryNotchDate: line.slice(165, 173).trim(),
      newSalaryNotch: parseInt(line.slice(173, 183).trim(), 10) || 0,
      newSalaryNotchDate: line.slice(183, 191).trim(),
      startDate: line.slice(191, 199).trim(),
      endDate: line.slice(199, 207).trim(),
      deductionType: line.slice(207, 211).trim(),
      flag: line.slice(211, 212).trim(),
      appointmentCode: line.slice(212, 220).trim(),
      location: line.slice(220, 250).trim(),
      branchCode: line.slice(250, 258).trim(),
    };
  }

  private parseTrailer(line: string): TrailerRecord {
    return {
      identifier: line.slice(0, 4).trim(),
      recordCount: parseInt(line.slice(4, 14).trim(), 10) || 0,
      checkTotal: parseInt(line.slice(14, 34).trim(), 10) || 0,
      amountTotal: parseInt(line.slice(34, 54).trim(), 10) || 0,
      balanceTotal: parseInt(line.slice(54, 74).trim(), 10) || 0,
      arrearsTotal: parseInt(line.slice(74, 94).trim(), 10) || 0,
    };
  }

  public validateFile(filePath: string): void {
    const originalFileContent = fs.readFileSync(filePath, 'utf-8').trim();
    const parsedData = this.parse();
    const reserializedData = this.serialize(parsedData).trim();

    if (originalFileContent === reserializedData) {
      console.log('The original and re-serialized data match perfectly.');
    } else {
      console.log('Mismatch found between the original and re-serialized data.');
      console.log('Original data:', originalFileContent);
      console.log('Re-serialized data:', reserializedData);
    }
  }

  public static createSampleData(): { header: HeaderRecord; transactions: TransactionRecord[]; trailer: TrailerRecord } {
    const header: HeaderRecord = {
      fileType: 'QOUT',
      clientIdentifier1: '0001',
      payrollIdentifier: '0001',
      layoutIdentifier: '0007',
      layoutRevision: 'V01',
      sequenceNumber: '1234',
      creationDate: '20240101',
      salaryMonth: '202401',
      clientIdentifier2: '10000000'
    };

    const transactions: TransactionRecord[] = [
      {
        transactionType: 'QADD',
        employeeNumber: '000000000012345',
        surname: 'Doe',
        initials: 'J.',
        idNumber: '1234567890123',
        referenceNumber: '1234567891234567890',
        subReference: '0000012345',
        amount: 100000, // Representing $1000.00
        balance: 50000, // Representing $500.00
        arrears: 2000, // Representing $20.00
        subsidy: 5000, // Representing $50.00
        balanceOfSubsidy: 10000, // Representing $100.00
        salaryNotch: 30000, // Salary notch value
        salaryNotchDate: '20231201', // Date in CCYYMMDD format
        newSalaryNotch: 32000,
        newSalaryNotchDate: '20240101', // Date in CCYYMMDD format
        startDate: '20240101',
        endDate: '20241231',
        deductionType: '0010',
        flag: 'A',
        appointmentCode: 'APPT01',
        location: 'LocationName01',
        branchCode: 'BRANCH1'
      },
      {
        transactionType: 'QPMT',
        employeeNumber: '000000000054321',
        surname: 'Smith',
        initials: 'A.',
        idNumber: '9876543210987',
        referenceNumber: '9876543210987654321',
        subReference: '0000054321',
        amount: 150000, // Representing $1500.00
        balance: 25000, // Representing $250.00
        arrears: 1000, // Representing $10.00
        subsidy: 3000, // Representing $30.00
        balanceOfSubsidy: 8000, // Representing $80.00
        salaryNotch: 28000,
        salaryNotchDate: '20230801',
        newSalaryNotch: 29000,
        newSalaryNotchDate: '20240101',
        startDate: '20240101',
        endDate: '20241231',
        deductionType: '0011',
        flag: 'B',
        appointmentCode: 'APPT02',
        location: 'LocationName02',
        branchCode: 'BRANCH2'
      }
    ];

    const trailer: TrailerRecord = {
      identifier: 'TRLR',
      recordCount: transactions.length,
      checkTotal: 200000,
      amountTotal: transactions.reduce((sum, txn) => sum + txn.amount, 0),
      balanceTotal: transactions.reduce((sum, txn) => sum + txn.balance, 0),
      arrearsTotal: transactions.reduce((sum, txn) => sum + txn.arrears, 0)
    };

    return { header, transactions, trailer };
  }
}
