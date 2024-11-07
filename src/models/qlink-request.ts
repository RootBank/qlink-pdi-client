import { Header } from "./header";
import { Logger } from "../utils/logger-util";
import { QLinkBase } from "./qlink-base";
import { Trailer } from "./trailer";
const logger = Logger.getInstance();

export class QLinkRequest extends QLinkBase {
  header: Header;
  data: QLinkBase[];
  trailer: Trailer;

  constructor(header: Header, data: QLinkBase | QLinkBase[], trailer?: Trailer) {
    super();
    this.header = header;
    this.data = Array.isArray(data) ? data : [data];
    this.trailer = trailer || new Trailer();
  }

  public toXML(): string {
    return this.wrapInQLink(this.header.toXML(), this.data[0].toXML())
  }

  public toFile(): string {
    const headerString = this.header.toFile();
    const transactionsString = this.data.map(transaction => transaction.toFile()).join('\n');
    const trailerString = this.trailer.toFile();

    return `${headerString}\n${transactionsString}\n${trailerString}`;
  }

  private wrapInQLink(headerXML: string, dataXML: string): string {
    logger.debug(
      `Wrapping header and data XML in QLINK tags\n<QLINK>${headerXML}${dataXML}</QLINK>`
    );
    return `<QLINK>${headerXML}${dataXML}</QLINK>`;
  }
}

