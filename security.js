/*
  security.js
  This script runs after the page loads and checks forms before they are sent.
*/

document.addEventListener('DOMContentLoaded', function () {
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
