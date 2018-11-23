/* Go Back History */
const goBack = () => window.history.back();
const btnBack = document.querySelector('.btn-back');
btnBack.addEventListener('click', goBack);
