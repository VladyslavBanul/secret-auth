import createElement from '../utils/createElement';

export default class LoginPage {
  refs = {};

  constructor(parent, appEvents) {
    this.createInitialMarkup();
    parent.append(this.refs.root);
    this.appEvents = appEvents;
  }

  createInitialMarkup() {
    const form = createElement('form', {
      onSubmit: (event) => {
        event.preventDefault();

        if (
          event.currentTarget.username.value &&
          event.currentTarget.password.value
        ) {
          this.appEvents.emit('auth#login');
        }
      },
      class: 'vertical',
    });

    const username = createElement('input', {
      placeholder: 'username',
      name: 'username',
    });

    const password = createElement('input', {
      type: 'password',
      placeholder: 'password',
      name: 'password',
    });

    const submitButton = createElement(
      'button',
      {
        type: 'submit',
      },
      ['submit']
    );

    const resetButton = createElement(
      'button',
      {
        type: 'submit',
        onClick: () => {
          this.appEvents.emit('secret#clear');
        },
      },
      ['reset']
    );

    form.append(username, password, submitButton, resetButton);

    this.refs.root = form;
  }

  destroy() {
    this.refs.root.remove();
    this.refs = {};
  }
}
