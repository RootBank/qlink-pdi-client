import { QLinkBase } from './qlink-base';

export class Trailer extends QLinkBase {
  identifier: string = 'TRLR';
  recordCount: number;
  checkTotal: number;
  amountTotal: number;
  balanceTotal: number;
  arrearsTotal: number;

  constructor(fields: Partial<Trailer> = {}) {
    super();
    this.identifier = fields.identifier || 'TRLR';
    this.recordCount = fields.recordCount || 0;
    this.checkTotal = fields.checkTotal || 0;
    this.amountTotal = fields.amountTotal || 0;
    this.balanceTotal = fields.balanceTotal || 0;
    this.arrearsTotal = fields.arrearsTotal || 0;
  }

  toXML(): string {
    return '';
  }

  toFile(): string {
    return (
      `${this.identifier.padEnd(4, ' ')}${String(this.recordCount).padStart(10, '0')}`
      + `${String(this.checkTotal).padStart(20, '0')}${String(this.amountTotal).padStart(20, '0')}`
      + `${String(this.balanceTotal).padStart(20, '0')}${String(this.arrearsTotal).padStart(20, '0')}`
    );
  }
}
