import './css/styles.css';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css'
import fetchPhoto from './fetchPhoto.js';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let searchQuery = '';
let  currentPage = 1;
const perPage = 40;

loadMoreBtn.classList.add('is-hidden');

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

const lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: "alt",
  captionsDelay: 250,
  loop: true,
  bindToItems: true,
  swipeClose: true,
  history: true,
  historyHash: "lightbox",
  widthRatio: 0.8,
  heightRatio: 0.9,
  scaleImageToRatio: true,
  enableZoom: true,
  zoomFactor: 2,
});


async function onSearch(event) {
  event.preventDefault();
  const searchQueryValue = event.currentTarget.elements.searchQuery.value.trim();

  if (!searchQueryValue) {
    return;
  }
  try {
    searchQuery = searchQueryValue;
    currentPage = 1;

    const photos = await fetchPhoto(searchQuery , currentPage);
    if (photos.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    gallery.innerHTML = createPhotoCardsMarkup(photos);
    Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
    if (photos.totalHits > 40) {
      loadMoreBtn.classList.remove('is-hidden');
    }
    lightbox.refresh();

  } catch (error) {
    console.log('error', error);
  }
}


function createPhotoCardsMarkup(photos) {
  return photos.hits
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => `
    <div class="card">
    <div class="photo-card">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
    </a>
    </div>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${downloads}
        </p>
      </div>
    </div>
  `
    )
    .join('');

    
}

async function onLoadMore() {
  try {
    const photos = await fetchPhoto(searchQuery, ++currentPage);
    gallery.insertAdjacentHTML('beforeend', createPhotoCardsMarkup(photos));
    

      const totalPages = Math.ceil(photos.totalHits / perPage);
      const loadedPages = Math.ceil(gallery.querySelectorAll('.card').length / perPage);
      // console.log(`totaPages: ${totalPages}`);
      // console.log(`loadedPages: ${loadedPages}`);
  
      if (loadedPages >= totalPages) {
        loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      }

    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
    });

    lightbox.refresh();
  } catch (error) {
    loadMoreBtn.classList.add('is-hidden');
    console.log('error', error);
  }
}