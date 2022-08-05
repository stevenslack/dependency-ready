/**
 * @jest-environment jsdom
 */
// const DependencyReady = require('./index');
// @ts-ignore
import DependencyReady from './index.ts';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

declare global {
  interface Window {
    foo: string;
  }
}

describe('Test DependencyReady class', () => {
  // eslint-disable-next-line max-len
  test('DependencyReady should be an object type with required properties and methods', () => {
    const depReady = new DependencyReady('');
    expect(typeof depReady).toBe('object');
    expect(depReady).toHaveProperty('property');
    expect(depReady).toHaveProperty('timeout');
    expect(depReady).toMatchObject({ property: '', timeout: 30000 });
  });
});

describe('Test DependencyReady methods', () => {
  beforeAll(() => {
    setTimeout(() => {
      window.foo = 'bar';
    }, 1000);
  });

  const depReady = new DependencyReady('foo', 2000);

  test('Ensure the test environment is set up.', () => {
    // Confirm the accepted parameters.
    expect(depReady).toHaveProperty('property', 'foo');
    expect(depReady).toHaveProperty('timeout', 2000);
    // Because of the setTimeout to 1000 the window has not set the property.
    expect(depReady.hasDependency()).toBeFalsy();
    expect(window.foo).toBeUndefined();
  });

  test('Test the call method.', () => {
    const testCallback = jest.fn(() => 'foo is ready');

    jest.runAllTimers();

    depReady.waitForDependency().then(() => {
      if (depReady.hasDependency() && typeof testCallback === 'function') {
        testCallback();
      }
      expect(testCallback).toBeCalled();
    });
    expect(depReady.hasDependency()).toBeTruthy();
    // The property is not available yet.
    expect(depReady.call(testCallback)).toBeUndefined();
  });

  test('the dependencyReady promise resolves undefined', async () => {
    await expect(depReady.waitForDependency()).resolves.toBeUndefined();
  });
});
