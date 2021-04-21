/** Implement lock/unlock algorithm to avoid duplicate calls */
export class Lock {
  /** Current requests locks */
  private locks: { [key: string]: boolean } = {};

  /** Wait to be unlocked */
  protected async wait(key: string): Promise<void> {
    if (!this.locks[key]) {
      return;
    }
    await new Promise((resolve) => {
      setTimeout(() => resolve(this.wait(key)), 10);
    });
  }
  /** Wait to be unlocked */
  protected lock(key: string): void {
    this.locks[key] = true;
  }
  /** Wait to be unlocked */
  protected unlock(key: string): void {
    this.locks[key] = false;
  }
}
