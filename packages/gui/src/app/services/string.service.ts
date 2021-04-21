import { Injectable } from '@angular/core';

@Injectable()
export class StringService {
  /** Constructor */
  constructor() {}

  /** Extract extension from a path */
  public extension(value: string): string {
    // If nothing
    if (!value) {
      return null;
    }
    // Get parts
    const parts = value.split('.');
    // If no ., returns null
    if (parts.length < 2) {
      return null;
    }
    // Returns last part
    return parts[parts.length - 1].toLowerCase();
  }
}
