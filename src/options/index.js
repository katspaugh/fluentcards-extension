const defaultOptions = {
  targetLanguage: 'en',
  behavior: 'double-click',
  ttsEnabled: false
};

// Saves options to chrome.storage.sync.
function saveOptions(form) {
  let data = {
    'userOptions': JSON.stringify({
      targetLanguage: form.elements.targetLanguage.value,
      behavior: form.elements.behavior.value,
      ttsEnabled: form.elements.tts.checked
    })
  };

  chrome.storage.sync.set(data, () => {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  });
}

// Restores the form state using the preferences stored in chrome.storage.
function restoreOptions(form) {
  chrome.storage.sync.get('userOptions', (data) => {
    let userOptions = Object.assign({}, defaultOptions, data.userOptions ? JSON.parse(data.userOptions) : {});
    form.elements.targetLanguage.value = userOptions.targetLanguage;
    form.elements.behavior.value = userOptions.behavior;
    form.elements.tts.checked = userOptions.ttsEnabled;
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  let form = document.getElementById('options-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveOptions(form);
  });

  restoreOptions(form);
});
