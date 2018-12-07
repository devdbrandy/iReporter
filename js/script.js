/* Go Back History */
const goBack = () => window.history.back();
const btnBack = document.querySelector('.btn-back');
btnBack.addEventListener('click', goBack);

/* Listing Uploaded Files */
const mediaFiles = document.getElementById('mediaFiles');
const dbTest = document.getElementById('dbtest');

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
