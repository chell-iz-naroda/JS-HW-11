import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '35797835-5db75a5f3a658babe088000e6';
const BASE_URL = 'https://pixabay.com/api/';

let currentPage = 1;
let searchQuery = '';

async function fetchPhoto(name, page = 1, perPage = 40) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: name,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: page, 
      },
    });
    const hits = response.data;
    return hits;
  } catch (error) {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    return;
  }
}

export default fetchPhoto;