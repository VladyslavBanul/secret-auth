class Secret {
  constructor() {
    this.secret = '';
  }

  generateSecret() {
    this.setSecret((Math.random() + 1).toString(36).substring(7));
  }

  setSecret(secret) {
    this.secret = secret;
  }
}
const SecretController = new Secret();

chrome.runtime.onStartup.addListener(() => {
  SecretController.generateSecret();
});

chrome.runtime.onInstalled.addListener((details) => {
  SecretController.generateSecret();

  if (details.reason == 'install') {
    chrome.tabs.create({
      url: 'browserPages/greeting.html',
    });
  }
});

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.type === 'regenerate') {
    SecretController.generateSecret();
  }
  sendResponse(SecretController.secret);
});
