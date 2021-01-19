import userOptions from '../common/services/user-options';

// Save options to the storage
function saveOptions(form) {
  const data = {
    targetLanguage: form.elements.targetLanguage.value,
    sourceLanguage: form.elements.sourceLanguage.value,
    autoDetectLanguage: form.elements.autoDetectLanguage.checked
  };

  userOptions.set(data).then(() => {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';

    setTimeout(() => {
      status.textContent = '';
    }, 750);
  });
}

// Restore the form state using the preferences stored in the storage.
function restoreOptions(form) {
  userOptions.get().then(options => {
    form.elements.targetLanguage.value = options.targetLanguage;
    form.elements.sourceLanguage.value = options.sourceLanguage;
    form.elements.autoDetectLanguage.checked = options.autoDetectLanguage;
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  let form = document.getElementById('options-form');

  restoreOptions(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveOptions(form);
  });
});
