/**
 * Dependency Ready.
 *
 * @param {mixed} property - The property to validate for it's existence on the global object.
 * @param {Number} timeout - (Optional) Time in milliseconds to wait for the property to be added 
 *                           to the global object. Default is 30 seconds or 30000 milliseconds.
 */
class DependencyReady {
  constructor(
    property,
    timeout = 30000
  ) {
    this.property = property || '';
    this.timeout = timeout || 30000;
  }

  /**
   * Determine if the dependency object is loaded and set in the global object.
   *
   * @returns {boolean}
   */
  hasDependency() {
    return typeof window !== 'undefined' ? Object.hasOwn(window, this.property) : false;
  }

  /**
   * Call a callback function when the property has been set in the global object.
   *
   * @param {Function} callback - A callback function.
   */
  call(callback = null) {
    if (typeof callback === 'function') {
      this.waitForDependency().then(() => {
        if (this.hasDependency()) {
          callback();
        }
      });
    }
  }

  /**
   * Wait for the property to be added to the global object with an async method.
   *
   * @returns {Promise}
   */
  async waitForDependency() {
    const time = Date.now() + this.timeout;
    // Runs until the timeout has past and property is ready.
    while (!this.hasDependency()) {
      try {
        await new Promise((resolve, reject) => {
          setTimeout(resolve, 100);

          if (time < Date.now()) {
            // Reject the promise if the timeout limit is reached.
            reject(`Timeout error. "window.${this.property}" is undefined`);
          }
        });
      } catch (e) {
        // Break the loop and display a console error.
        console.error(e);
        break;
      }
    }
  }
}
