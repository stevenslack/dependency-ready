---
layout: default
---


Dependency Ready is a JavaScript class with the sole purpose of waiting for properties to be defined on the standardized [global object](https://developer.mozilla.org/en-US/docs/Glossary/Global_object), [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis), in order to fire a callback function that relies on the global objects property.

### Playground
In the section below we are assuming that a third-party is adding a property of `foo` to the global object. Below is a playground for testing how dependency-ready works by defining foo on the global object at a certain time. You can set the time at which to define the property and for how long to wait for the property using dependency-ready.