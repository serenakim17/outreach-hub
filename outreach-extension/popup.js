document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const notesInput = document.getElementById('notes');
  const subjectInput = document.getElementById('subject');
  const bodyInput = document.getElementById('body');
  const copyBtn = document.getElementById('copyBtn');
  const sendBtn = document.getElementById('sendBtn');
  const statusDiv = document.getElementById('status');

  // Insert research notes into body at cursor position
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const notesContent = notesInput.value || '';
      
      const start = bodyInput.selectionStart || 0;
      const end = bodyInput.selectionEnd || 0;
      const currentText = bodyInput.value;

      bodyInput.value = currentText.substring(0, start) + notesContent + currentText.substring(end);
      bodyInput.focus();
      
      // Set cursor right after inserted text
      const newCursorPos = start + notesContent.length;
      bodyInput.setSelectionRange(newCursorPos, newCursorPos);
    });
  });

  // Copy subject and body to clipboard
  copyBtn.addEventListener('click', () => {
    const fullContent = `Subject: ${subjectInput.value}\n\n${bodyInput.value}`;
    navigator.clipboard.writeText(fullContent).then(() => {
      statusDiv.style.display = 'block';
      setTimeout(() => { statusDiv.style.display = 'none'; }, 2000);
    });
  });

  // Open direct Gmail compose window
  sendBtn.addEventListener('click', () => {
    const to = encodeURIComponent(emailInput.value);
    const sub = encodeURIComponent(subjectInput.value);
    const bodyText = encodeURIComponent(bodyInput.value);
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${sub}&body=${bodyText}`;
    chrome.tabs.create({ url: gmailUrl });
  });
});
