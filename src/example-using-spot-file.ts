import { SpotFileParser } from "./serialization/spot-file-parser";

const filename: string = './sample-data/spot-file-sample.txt';
const parser = new SpotFileParser(filename);
const parsedData = parser.parse();
parser.validateFile(filename);

const { header, transactions, trailer } = SpotFileParser.createSampleData();
if (JSON.stringify(header) === JSON.stringify(parsedData.header)) {
  console.log("Sample header matches parsed header");
} else {
  console.log("Mismatch found between sample and parsed headers:");
  console.log("Sample Header:", header);
  console.log("Parsed Header:", parsedData.header);
}

if (JSON.stringify(transactions) === JSON.stringify(parsedData.transactions)) {
  console.log("Sample transactions match parsed transactions");
} else {
  console.log("Mismatch found between sample and parsed transactions:");

  transactions.forEach((transaction, index) => {
    const parsedTransaction = parsedData.transactions[index];

    Object.keys(transaction).forEach((key) => {
      if (transaction[key as keyof typeof transaction] !== parsedTransaction[key as keyof typeof parsedTransaction]) {
        console.log(`Mismatch in transaction ${index + 1}, field '${key}':`);
        console.log("Sample Transaction Value:", transaction[key as keyof typeof transaction]);
        console.log("Parsed Transaction Value:", parsedTransaction[key as keyof typeof parsedTransaction]);
      }
    });
  });
}

if (JSON.stringify(trailer) === JSON.stringify(parsedData.trailer)) {
  console.log("Sample trailer matches parsed trailer");
} else {
  console.log("Mismatch found between sample and parsed trailers:");
  console.log("Sample Trailer:", trailer);
  console.log("Parsed Trailer:", parsedData.trailer);
}
