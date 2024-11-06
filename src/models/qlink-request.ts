import { Header } from "./header";
import { Logger } from "../utils/logger-util";
import { QLinkBase } from "./qlink-base";
const logger = Logger.getInstance();

export class QLinkRequest extends QLinkBase {
  header: Header;
  data: QLinkBase;

  constructor(header: Header, data: QLinkBase) {
    super();
    this.header = header;
    this.data = data;
  }

  public toXML(): string {
    return this.wrapInQLink(this.header.toXML(), this.data.toXML())
  }


  private wrapInQLink(headerXML: string, dataXML: string): string {
    logger.debug(
      `Wrapping header and data XML in QLINK tags\n<QLINK>${headerXML}${dataXML}</QLINK>`
    );
    return `<QLINK>${headerXML}${dataXML}</QLINK>`;
  }
}

