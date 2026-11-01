document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const notesInput = document.getElementById('notes');
  const subjectInput = document.getElementById('subject');
  const bodyInput = document.getElementById('body');
  const copyBtn = document.getElementById('copyBtn');
  const sendBtn = document.getElementById('sendBtn');
  const statusDiv = document.getElementById('status');

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const varTag = chip.getAttribute('data-var');
      let replacement = varTag === '{{Research Notes}}' ? (notesInput.value || '') : varTag;
      const start = bodyInput.selectionStart;
      const end = bodyInput.selectionEnd;
      bodyInput.value = bodyInput.value.substring(0, start) + replacement + bodyInput.value.substring(end);
      bodyInput.focus();
    });
  });

  copyBtn.addEventListener('click', () => {
    const fullContent = `Subject: ${subjectInput.value}\n\n${bodyInput.value}`;
    navigator.clipboard.writeText(fullContent).then(() => {
      statusDiv.style.display = 'block';
      setTimeout(() => statusDiv.style.display = 'none', 2000);
    });
  });

  sendBtn.addEventListener('click', () => {
    const to = encodeURIComponent(emailInput.value);
    const sub = encodeURIComponent(subjectInput.value);
    const bodyText = encodeURIComponent(bodyInput.value);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${sub}&body=${bodyText}`;
    chrome.tabs.create({ url: gmailUrl });
  });
});
