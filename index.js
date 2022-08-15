/**
 * Dependency Ready.
 *
 * @param property - The name of the property to validate its definition on the global object.
 * @param timeout - (Optional) Time in milliseconds to wait for the property to be defined
 *                             on the global object. Default is 30 seconds or 30000 milliseconds.
 */
export default class DependencyReady {
    property;
    timeout;
    constructor(property, timeout = 30000) {
        this.property = property;
        this.timeout = timeout;
    }
    /**
     * A method to determine whether the property is defined on the global object.
     */
    hasDependency() {
        return typeof globalThis !== 'undefined'
            ? Object.hasOwn(globalThis, this.property) : false;
    }
    /**
     * A method to call a function when the property has been defined on the global object.
     *
     * @param callback - A callback function.
     */
    call(callback) {
        this.waitForDependency().then((isReady) => {
            if (isReady && typeof callback === 'function') {
                callback();
            }
        });
    }
    /**
     * An method which will wait for the property to be defined on the global object and return a Promise.
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
                        new Error(`Timeout error. "globalThis.${this.property}" is undefined`));
                    }
                    setTimeout(resolve, 100);
                });
            }
            catch (e) {
                // eslint-disable-next-line no-console
                console.log(e);
                break;
            }
        }
        return this.hasDependency();
    }
}
