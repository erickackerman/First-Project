document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#local-upload-form');
  const fileInput = document.querySelector('#local-photo-file');
  const status = document.querySelector('#local-upload-status');
  const result = document.querySelector('#local-upload-result');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const file = fileInput.files[0];

    if (!file) {
      status.textContent = 'Choose a photo first.';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    status.textContent = 'Saving locally...';
    result.textContent = '';

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Server returned status ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      const link = document.createElement('a');
      link.href = data.url;
      link.textContent = data.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      result.append(link);
      status.textContent = 'Saved. Copy this URL into your site CSS or HTML.';
      form.reset();
    } catch (error) {
      status.textContent = `${error.message}. Make sure the local server is running.`;
    }
  });
});
