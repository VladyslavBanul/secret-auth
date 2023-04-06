import CryptoJS from 'crypto-js';
import EventEmitter from 'eventemitter3';

import Login from './Login';
import Main from './User';
import Password from './Password';
import createElement from '../utils/createElement';
import { SALT } from '../constants';

const States = { LOGGEDIN: 1, CONFIRMED: 2, INITIAL: 3 };

export default class App {
  Events = new EventEmitter();
  currentView = null;
  state = null;
  secret = '';
  refs = {};

  constructor() {
    this.Events.on('secret#submit', () => {
      this.setState(States.CONFIRMED);
      this.getSecretFromBackground((response) => {
        this.storeSecret(response);
        this.setSecret(response);
      });
    });
    this.Events.on('secret#change', () => {
      this.setState(States.LOGGEDIN);
      this.regenerateSecret((response) => {
        this.storeSecret(response);
        this.setSecret(response);
      });
    });
    this.Events.on('secret#clear', () => {
      chrome.storage.local.clear();
      this.setSecret('');
      this.setState(States.INITIAL);
      this.regenerateSecret((response) => {
        this.setSecret(response);
      });
    });
    this.Events.on('auth#login', () => {
      chrome.storage.local.set({ isUserLoggedIn: true }, () => {
        this.setState(States.LOGGEDIN);
      });
    });
    this.Events.on('auth#logout', () => {
      chrome.storage.local.set({ isUserLoggedIn: false }, () => {
        this.setState(States.CONFIRMED);
      });
    });
    this.Events.on('secret#changed', () => {
      this.rerender();
    });

    this.createInitialMarkup();
    this.initialiseDefaultValues();
  }

  setState(state) {
    if (state !== this.state) {
      this.currentView?.destroy();
      this.state = state;
      this.updateCurrentView();
    }
  }

  getSecretFromBackground(callback) {
    chrome.runtime.sendMessage({ type: 'getSecret' }, callback);
  }

  regenerateSecret(callback) {
    chrome.runtime.sendMessage({ type: 'regenerate' }, callback);
  }

  updateCurrentView() {
    switch (this.state) {
      case States.CONFIRMED:
        this.currentView = new Login(this.refs.root, this.Events);
        break;
      case States.LOGGEDIN:
        this.currentView = new Main(this.refs.root, this.Events, this.secret);

        break;
      case States.INITIAL:
        this.currentView = new Password(
          this.refs.root,
          this.Events,
          this.secret
        );
        break;
    }
  }

  setSecret(secret) {
    if (this.secret !== secret) {
      this.secret = secret;
      this.Events.emit('secret#changed');
    }
  }

  createInitialMarkup() {
    const app = createElement('div', { class: 'app' });
    this.refs.root = app;
  }

  initialiseDefaultValues() {
    chrome.storage.local.get(['isUserLoggedIn', 'encryptedSecret'], (data) => {
      if (data?.encryptedSecret) {
        const secret = this.decryptSecret(data.encryptedSecret);
        if (secret) {
          this.setSecret(secret);
        }

        this.setState(
          data?.isUserLoggedIn ? States.LOGGEDIN : States.CONFIRMED
        );
      } else {
        this.getSecretFromBackground((response) => {
          this.setSecret(response);
          this.setState(States.INITIAL);
        });
      }
    });
  }

  storeSecret(secret) {
    const encryptedSecret = CryptoJS.AES.encrypt(secret, SALT).toString();
    chrome.storage.local.set({ encryptedSecret });
  }

  decryptSecret(secret) {
    try {
      const bytes = CryptoJS.AES.decrypt(secret, SALT);
      const decryptedSecret = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedSecret;
    } catch (err) {
      return null;
    }
  }

  rerender() {
    this.currentView?.destroy();
    this.updateCurrentView();
  }
}
