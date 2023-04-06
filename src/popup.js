import App from './models/App';

const app = new App();

document.addEventListener('DOMContentLoaded', () => {
  document.body.append(app.refs.root);
});
