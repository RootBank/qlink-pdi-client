/**
 * Any interaction with Qlink must extend the base class
 */
export abstract class QLinkBase {
  /**
   * Converts the instance data to XML format.
   * This method must be implemented by derived classes.
   */
  abstract toXML(): string;
}
