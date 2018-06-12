import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import requestAnimationFrame from './tempPolyfills'; // eslint-disable-line

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

configure({ adapter: new Adapter(), disableLifecycleMethods: true });
