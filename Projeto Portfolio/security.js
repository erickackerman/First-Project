/*
  security.js
  This script runs after the page loads and checks forms before they are sent.
*/

document.addEventListener('DOMContentLoaded', function () {
  const cloudName = 'flgmucfs';
  const uploadPreset = 'Background Main';
  const uploadForm = document.querySelector('#photo-upload-form');

  if (uploadForm) {
    uploadForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const fileInput = uploadForm.querySelector('#photo-file');
      const status = uploadForm.querySelector('#upload-status');
      const result = uploadForm.querySelector('#upload-result');
      const file = fileInput.files[0];

      if (!file) {
        status.textContent = 'Choose a photo first.';
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      status.textContent = 'Uploading...';
      result.textContent = '';

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const uploadedImage = await response.json();
        const link = document.createElement('a');
        link.href = uploadedImage.secure_url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Open uploaded photo';
        result.append(link);
        status.textContent = 'Photo uploaded successfully.';
        uploadForm.reset();
      } catch (error) {
        status.textContent = 'The upload could not be completed. Check your Cloudinary settings and try again.';
      }
    });
  }

  // 1) Find all forms that send to Formspree
  const forms = document.querySelectorAll('form[action*="formspree.io"]');

  // 2) For each form, add a submit check
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      // Find the feedback textarea and the selected rating
      const feedback = form.querySelector('#feedback');
      const rating = form.querySelector('input[name="rating"]:checked');

      // 3) Validate feedback text if the field exists
      if (feedback) {
        const value = feedback.value.trim();

        if (value.length === 0) {
          event.preventDefault(); // stop sending the form
          alert('Por favor, escreva seu feedback antes de enviar.');
          feedback.focus();
          return;
        }

        if (value.length > 500) {
          event.preventDefault();
          alert('O feedback deve ter no máximo 500 caracteres.');
          feedback.focus();
          return;
        }
      }

      // 4) Validate rating only if the form has rating inputs
      const ratingInputs = form.querySelectorAll('input[name="rating"]');
      if (ratingInputs.length > 0 && !rating) {
        event.preventDefault();
        alert('Por favor, escolha uma nota antes de enviar.');
      }
    });
  });
});
