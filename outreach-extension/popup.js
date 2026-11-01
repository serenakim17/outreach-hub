document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const notesInput = document.getElementById('notes');
  const subjectInput = document.getElementById('subject');
  const bodyInput = document.getElementById('body');
  const copyBtn = document.getElementById('copyBtn');
  const sendBtn = document.getElementById('sendBtn');
  const statusDiv = document.getElementById('status');

  // Insert variable tag at cursor inside body
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const varTag = chip.getAttribute('data-var');
      let replacement = varTag;
      if (varTag === '{{Research Notes}}') {
        replacement = notesInput.value || '';
      }
      
      const start = bodyInput.selectionStart;
      const end = bodyInput.selectionEnd;
      const text = bodyInput.value;
      bodyInput.value = text.substring(0, start) + replacement + text.substring(end);
      bodyInput.focus();
    });
  });

  // Copy subject and body to clipboard
  copyBtn.addEventListener('click', () => {
    const fullContent = `Subject: ${subjectInput.value}\n\n${bodyInput.value}`;
    navigator.clipboard.writeText(fullContent).then(() => {
      statusDiv.style.display = 'block';
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 2000);
    });
  });

  // Open direct Gmail compose window pre-filled with email, subject, and body
  sendBtn.addEventListener('click', () => {
    const to = encodeURIComponent(emailInput.value);
    const sub = encodeURIComponent(subjectInput.value);
    const bodyText = encodeURIComponent(bodyInput.value);
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${sub}&body=${bodyText}`;
    chrome.tabs.create({ url: gmailUrl });
  });
});
