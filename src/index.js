import './css/styles.css';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css'
import fetchPhoto from './fetchPhoto.js';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

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
    const search = searchQueryValue;
    currentPage = 1;
    const photos = await fetchPhoto(search, currentPage);
    if (photos.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
    gallery.innerHTML = createPhotoCardsMarkup(photos);
    loadMoreBtn.classList.remove('is-hidden');
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
    if (photos.length === 0) {
        
        return;
      }
    gallery.insertAdjacentHTML('beforeend', createPhotoCardsMarkup(photos));
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