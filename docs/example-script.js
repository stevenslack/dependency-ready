// Import our module.
// eslint-disable-next-line import/extensions
import DependencyReady from '../src/index.js';
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
