"use strict";
// Import our module.
// eslint-disable-next-line import/extensions
/**
 * Dependency Ready.
 *
 * @param property - The name of the property to validate for it's existence on the global object.
 * @param timeout - (Optional) Time in milliseconds to wait for the property to be added
 *                             to the global object. Default is 30 seconds or 30000 milliseconds.
 */
class DependencyReady {
    property;
    timeout;
    constructor(property, timeout = 30000) {
        this.property = property;
        this.timeout = timeout;
    }
    /**
     * Determine if the dependency object is loaded and set in the global object.
     */
    hasDependency() {
        return typeof window !== 'undefined'
            ? Object.hasOwn(window, this.property) : false;
    }
    /**
     * Call a callback function when the property has been set in the global object.
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
                        new Error(`Timeout error. "window.${this.property}" is undefined`));
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
const fireButton = document.querySelector('.fire-depready');
const resetButton = document.querySelector('.reset-test');
const notReadyNode = document.getElementById('foo-not-ready');
const readyNode = document.getElementById('foo-ready');
const waiting = document.getElementById('foo-wait');
const timeoutEl = document.getElementById('timeout');
const setTimeoutEl = document.getElementById('settimeout');
function reset() {
    waiting?.classList.remove('show');
    readyNode?.classList.remove('show');
    notReadyNode?.classList.remove('show');
    resetButton?.classList.remove('show');
}
function ready() {
    waiting?.classList.remove('show');
    readyNode?.classList.add('show');
    resetButton?.classList.add('show');
}
function notReady() {
    waiting?.classList.remove('show');
    notReadyNode?.classList.add('show');
    resetButton?.classList.add('show');
}
if (fireButton) {
    fireButton.addEventListener('click', () => {
        // @ts-ignore
        const timeoutValue = timeoutEl?.value || 5000;
        // @ts-ignore
        const setTimeoutValue = setTimeoutEl?.value || 4000;
        waiting?.classList.add('show');
        setTimeout(() => {
            // @ts-ignore
            window.foo = 'I am foo!';
        }, Number(setTimeoutValue));
        const depReady = new DependencyReady('foo', Number(timeoutValue));
        depReady.waitForDependency().then((isReady) => {
            if (isReady) {
                ready();
            }
            else {
                notReady();
            }
        });
    });
}
resetButton?.addEventListener('click', () => {
    // @ts-ignore
    if (typeof window?.foo !== 'undfined') {
        // @ts-ignore
        delete window.foo;
    }
    reset();
});
