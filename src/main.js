// Додатковий імпорт стилів

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

const lightbox = new SimpleLightbox('.gallery a', {
  captionPosition: 'bottom',
  captionDelay: 250,
  captionsData: 'alt',
  captions: true,
});

let searchQuery = '';

form.addEventListener('submit', onSabmit);
function onSabmit(e) {
  e.preventDefault();
  searchQuery = e.target.elements.search.value.trim();
  if (searchQuery) {
    clearGallery();
    showLoader();
    searchImages(searchQuery);
  }
  e.target.reset();
}

function searchImages(q) {
  const API_KEY = '42003708-c000c9a8ce48958e4d2fbd571';
  const PARAMS = new URLSearchParams({
    key: API_KEY,
    q,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });
  const BAS_EURL = 'https://pixabay.com/api';
  const url = `${BAS_EURL}/?${PARAMS}`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      hideLoader();
      if (data.hits.length > 0) {
        displayImages(data.hits);
      } else {
        showNoResultsMessage();
      }
    })
    .catch(error => {
      console.error('Error fetching images:', error);
      hideLoader();
      showErrorMessage();
    });
}

function displayImages(images) {
  const fragment = document.createDocumentFragment();

  const limitedImages = images.slice(0, 9);

  limitedImages.forEach(image => {
    const card = createImageCard(image);
    fragment.appendChild(card);
  });

  gallery.appendChild(fragment);

  lightbox.refresh();
}

function createImageCard(image) {
  const { likes, views, comments, downloads } = image;

  const card = document.createElement('div');
  card.classList.add('card');

  const link = document.createElement('a');
  link.classList.add('gallery-link');
  link.href = image.largeImageURL;

  const img = document.createElement('img');
  img.classList.add('img-pixaby');
  img.src = image.webformatURL;
  img.alt = image.tags;

  const commentDiv = document.createElement('div');
  commentDiv.classList.add('comments');
  commentDiv.textContent = `Comments: ${comments},Likes: ${likes}, Views: ${views},Downloads: ${downloads}`;

  card.appendChild(commentDiv);
  card.appendChild(link);
  link.appendChild(img);
  return card;
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

function showNoResultsMessage() {
  iziToast.info({
    title: 'Info',
    position: 'topRight',
    color: 'green',
    message:
      'Sorry, there are no images matching your search query. Please try again.',
  });
}

function showErrorMessage() {
  iziToast.error({
    title: 'Error',
    position: 'topRight',
    color: 'red',
    message: 'Something went wrong. Please try again later.',
  });
}
