import createElement from '../utils/createElement';

export default class User {
  refs = {};

  constructor(parent, appEvents, secret) {
    this.secret = secret;
    this.createInitialMarkup();
    parent.append(this.refs.root);
    this.appEvents = appEvents;
  }

  createInitialMarkup() {
    const container = createElement('div', { class: 'vertical' });
    const regenerateButton = createElement(
      'button',
      {
        onClick: () => {
          this.appEvents.emit('secret#change');
        },
      },
      ['Regenerate']
    );

    const logoutButton = createElement(
      'button',
      {
        type: 'submit',
        onClick: () => {
          this.appEvents.emit('auth#logout');
        },
      },
      ['Logout']
    );

    container.append(this.secret, regenerateButton, logoutButton);

    this.refs.root = container;
  }

  destroy() {
    this.refs.root.remove();
    this.refs = {};
  }
}
