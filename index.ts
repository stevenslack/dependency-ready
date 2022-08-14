/**
 * Dependency Ready.
 *
 * @param property - The name of the property to validate for it's existence on the global object.
 * @param timeout - (Optional) Time in milliseconds to wait for the property to be added
 *                             to the global object. Default is 30 seconds or 30000 milliseconds.
 */
export default class DependencyReady {
  property: string;

  timeout: number;

  constructor(
    property: string,
    timeout: number = 30000,
  ) {
    this.property = property;
    this.timeout = timeout;
  }

  /**
   * Determine if the dependency object is loaded and set in the global object.
   */
  hasDependency(): boolean {
    return typeof globalThis !== 'undefined'
      ? Object.hasOwn(globalThis, this.property) : false;
  }

  /**
   * Call a callback function when the property has been set in the global object.
   *
   * @param callback - A callback function.
   */
  call(callback: Function) {
    this.waitForDependency().then((isReady: boolean) => {
      if (isReady && typeof callback === 'function') {
        callback();
      }
    });
  }

  /**
   * Wait for the property to be added to the global object with an async method.
   */
  async waitForDependency() {
    const time = Date.now() + this.timeout;

    // Runs until the timeout has past and property is ready.
    while (!this.hasDependency()) {
      try {
        // Promise.all significantly reduces performance as it must process
        // all of the promises added to an array. This is why a Promise await is used.
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve, reject) => {
          if (time < Date.now()) {
            // Reject the promise if the timeout limit is reached.
            reject(
              // eslint-disable-next-line max-len
              new Error(`Timeout error. "globalThis.${this.property}" is undefined`),
            );
          }

          setTimeout(resolve, 100);
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        break;
      }
    }

    return this.hasDependency();
  }
}
