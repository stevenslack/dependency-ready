# dependency-ready

A JavaScript class with the sole purpose of waiting for properties to be defined on the standardized [global object](https://developer.mozilla.org/en-US/docs/Glossary/Global_object), [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis), in order to fire a callback function that relies on the global objects property.

### Use cases

This is particularly useful in environments using third parties or other scripts where your script may rely on another property defined on the global object. In many cases you have no way of knowing when that property will be defined which could result in a race condition and an error in your application.

Using `dependency-ready` allows you to fire a callback function once that property has been defined on the global object. The script will "wait" for the defined property using `async/await` and return a Promise which will call your callback function.

### Install

1. Install `dependency-ready` in your projects dependencies:
```sh
npm install dependency-ready
```
2. Import `dependency-ready` in your script.
```js
import DependencyReady from 'dependency-ready';
```
### The `DependencyReady` class properties and methods:

The DependencyReady class accepts the following parameters which define the class properties:
| Parameters   | type              | default | description |
|:-------------|:------------------|:--------|:------------|
| property     | `string`          |         | (**Required**) The name of the property to validate its definition on the global object. |
| timeout      | `number`          | `30000` | Time in milliseconds to wait for the property to be defined on the global object. Default is 30 seconds or 30000 milliseconds. |

The `DependencyReady` class has the following methods available:
| Methods | description |
|:--------|:------------|
| `hasDependency()` | Function to determine whether the property is defined on the global object. |
| `call(callback: Function)` | A method to call a function when the property has been defined on the global object. |
| `waitForDependency()` | An method which will wait for the property to be defined on the global object and return a `Promise`. |

### Examples

Below is a simple example using `dependency-ready` to wait for a global object property in your project. Let's say that you are waiting for a third party to define the `foo` property on the global object. Once that property is defined you will want to fire your custom script which may use some of the data from `foo`. 
```js
// The callback function to fire once globalThis.foo is ready.
const callbackFunction = () {
  console.log('foo is ready!');
  return true;
}

// Wait for globalThis.foo to be defined.
const depReady = new DependencyReady('foo');

// Call the callbackFunction only when globalThis.foo is defined.
depReady.call(callbackFunction);
```
