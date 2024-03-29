// Додатковий імпорт стилів

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more-btn');

const lightbox = new SimpleLightbox('.gallery a', {
  captionPosition: 'bottom',
  captionDelay: 250,
  captionsData: 'alt',
  captions: true,
});

let searchQuery = '';
let page = 1;
const limit = 40;

form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  searchQuery = e.target.elements.search.value.trim();
  if (searchQuery) {
    clearGallery();
    showLoader();
    page = 1;
    searchImages(searchQuery, page);
  }
  e.target.reset();
}

const API_KEY = '42003708-c000c9a8ce48958e4d2fbd571';
const BASE_URL = 'https://pixabay.com/api/';

async function searchImages(q, page) {
  const searchParams = {
    key: API_KEY,
    q,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: limit,
  };
  try {
    const response = await axios.get(BASE_URL, {
      params: searchParams,
    });
    hideLoader();
    if (response.data.hits.length > 0) {
      displayImages(response.data.hits);
    } else {
      showNoResultsMessage();
    }

    loadMoreBtn.addEventListener('click', loadMoreImages);

    const totalPages = Math.ceil(response.data.totalHits / limit);
    if (page >= totalPages) {
      loadMoreBtn.style.display = 'none';
      // iziToast.info({
      //   title: 'Info',
      //   position: 'topRight',
      //   color: 'green',
      //   message: "We're sorry, but you've reached the end of search results.",
      // });
    } else {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    hideLoader();
    showErrorMessage();
  }
}
function loadMoreImages() {
  showLoader();
  page += 1;
  searchImages(searchQuery, page);
  scrollToCardHeight();
}
function scrollToCardHeight() {
  const elem = document.querySelector('.card');
  if (elem) {
    const rect = elem.getBoundingClientRect();
    rect.height = rect.height * 2;
    window.scrollBy({
      top: rect.height,
      behavior: 'smooth',
    });
  }
}
// ==================================================
//    Обмежена кількість карток додавання до галереї
// ==================================================
function displayImages(images) {
  const fragment = document.createDocumentFragment();

  images.forEach(image => {
    const card = createImageCard(image);
    fragment.appendChild(card);
  });

  gallery.appendChild(fragment);
  lightbox.refresh();
  // scroll();
}

// ===============SCROLL==============

// function scroll() {
//   const galleryHeight = document
//     .querySelector('.card')
//     .getBoundingClientRect().height;
//   const total = galleryHeight * 2;
//   window.scrollBy({
//     top: total,
//     behavior: 'smooth',
//   });
// }
// ===============================
//    Створення картки з описом
// ===============================
function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('card');

  const link = document.createElement('a');
  link.classList.add('gallery-link');
  link.href = image.largeImageURL;

  const img = document.createElement('img');
  img.classList.add('img-pixaby');
  img.src = image.webformatURL;
  img.alt = image.tags;

  const listCom = document.createElement('ul');
  listCom.classList.add('comments');

  const likesItem = document.createElement('li');
  likesItem.classList.add('list-item-com');
  likesItem.textContent = `Likes: ${image.likes}`;
  listCom.appendChild(likesItem);

  const viewsItem = document.createElement('li');
  viewsItem.classList.add('list-item-com');
  viewsItem.textContent = `Views: ${image.views}`;
  listCom.appendChild(viewsItem);

  const commentsItem = document.createElement('li');
  commentsItem.classList.add('list-item-com');
  commentsItem.textContent = `Comments: ${image.comments}`;
  listCom.appendChild(commentsItem);

  const downloadsItem = document.createElement('li');
  downloadsItem.classList.add('list-item-com');
  downloadsItem.textContent = `Downloads: ${image.downloads}`;
  listCom.appendChild(downloadsItem);

  link.appendChild(img);
  card.appendChild(listCom);
  card.appendChild(link);

  return card;
}
//
//
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
