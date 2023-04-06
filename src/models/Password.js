import createElement from '../utils/createElement';

export default class LoginPage {
  refs = {};

  constructor(parent, appEvents, secret) {
    this.secret = secret;
    this.createInitialMarkup();
    parent.append(this.refs.root);
    this.parent = parent;
    this.appEvents = appEvents;
  }

  createInitialMarkup() {
    const form = createElement('form', {
      onSubmit: (event) => {
        event.preventDefault();

        if (
          event.currentTarget.password.value ===
          event.currentTarget.passwordConfirm.value
        ) {
          this.appEvents.emit('secret#submit');
        }
      },
      class: 'vertical',
    });
    const password = createElement('input', {
      type: 'password',
      placeholder: 'password',
      name: 'password',
    });
    const confirmPassword = createElement('input', {
      type: 'password',
      placeholder: 'confirm password',
      name: 'passwordConfirm',
    });
    const submitButton = createElement(
      'button',
      {
        type: 'submit',
      },
      ['submit']
    );

    form.append(this.secret, password, confirmPassword, submitButton);

    this.refs.root = form;
  }

  destroy() {
    this.refs.root.remove();
    this.refs = {};
  }
}
