/* eslint-disable */

/* Go Back History */
const btnBack = document.querySelector('.btn-back');
const goBack = () => window.history.back();
if (btnBack) {
  btnBack.addEventListener('click', goBack);
}

/* Listing Uploaded Files */
const mediaFiles = document.getElementById('mediaFiles');
const dbTest = document.getElementById('dbtest');

if (mediaFiles) {
  mediaFiles.addEventListener('change', (e) => {
    const mediaList = document.querySelector('.media-list');
    const { files } = e.target;
    const ul = document.createElement('ul');

    for (let i = 0; i < files.length; i += 1) {
      const li = document.createElement('li');
      const fileDetails = document.createTextNode(files[i].name);
      const span = document.createElement('span');
      const iTag = document.createElement('i');
      iTag.className = 'fas fa-check';
      span.appendChild(iTag);

      li.appendChild(fileDetails);
      li.appendChild(span);
      ul.appendChild(li);
    }
    mediaList.appendChild(ul);
  });
}

/* Warning on delete button */
const removeButton = document.querySelectorAll('.remove');
if (removeButton.length > 0) {
  removeButton.forEach((button) => {
    button.addEventListener('click', () => {
      confirm('Hey Captain, sure you wanna do that?');
    });
  });
}

/* Modal toggler */
const modal = document.getElementById('modal');
const modalBtn = document.getElementById('modalBtn');
const closeBtn = document.querySelector('.modal--close');

const openModal = () => { modal.style.display = 'block'; };
const closeModal = () => { modal.style.display = 'none'; };

closeBtn.addEventListener('click', closeModal);
window.onclick = (event) => {
  if (event.target === modal) closeModal();
};
if (modalBtn) {
  modalBtn.addEventListener('click', openModal);
}
/* End Modal trigger */
