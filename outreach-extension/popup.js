document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const notesInput = document.getElementById('notes');
  const subjectInput = document.getElementById('subject');
  const bodyInput = document.getElementById('body');
  const generateBtn = document.getElementById('generateBtn');
  const insertNotesChip = document.getElementById('insertNotesChip');
  const copyBtn = document.getElementById('copyBtn');
  const sendBtn = document.getElementById('sendBtn');
  const statusDiv = document.getElementById('status');

  // Auto-generate subject and body based on research notes
  generateBtn.addEventListener('click', () => {
    const notes = notesInput.value.trim();
    if (!notes) {
      alert('Please enter some research notes first!');
      return;
    }

    // Set a formatted subject line
    subjectInput.value = 'Re: Research & Connection Inquiry';

    // Build the formatted email body
    const emailBody = `Hello,\n\nI came across your work and wanted to reach out regarding the following details:\n\n"${notes}"\n\nI would love to learn more about your current projects and discuss potential ways to collaborate.\n\nBest regards,\n[Your Name]`;

    bodyInput.value = emailBody;
  });

  // Insert research notes into body at cursor position
  insertNotesChip.addEventListener('click', () => {
    const notesContent = notesInput.value || '';
    const start = bodyInput.selectionStart || 0;
    const end = bodyInput.selectionEnd || 0;
    const currentText = bodyInput.value;

    bodyInput.value = currentText.substring(0, start) + notesContent + currentText.substring(end);
    bodyInput.focus();

    const newCursorPos = start + notesContent.length;
    bodyInput.setSelectionRange(newCursorPos, newCursorPos);
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
