import axios from 'axios';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
//встановили бібліотеку спінер джс
import { Spinner } from 'spin.js';

// const input = document.querySelector('.search-input');
const form = document.querySelector('.js-search-form');
const searchBtn = document.querySelector('.search-btn');
const gallery = document.querySelector('.js-gallery');

form.addEventListener('submit', onSearchClick);

let searchQuery = null;
let page = 1;
const perPage = 12;

axios.defaults.baseURL = 'https://api.unsplash.com';
axios.defaults.headers.common['Authorization'] =
  'Client-ID LxvKVGJqiSe6NcEVZOaLXC-f2JIIWZaq_o0WrF8mwJc';

const simplelightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

function getPhotos(query, page = 1, perPage) {
  return axios.get('/search/photos', {
    params: {
      page,
      query,
      orientation: 'portrait',
      per_page: perPage,
    },
  });
}
///////////////////////SPINNER/////////////////////////

const opts = {
  lines: 17, // The number of lines to draw
  length: 33, // The length of each line
  width: 52, // The line thickness
  radius: 14, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1.6, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#7f9083', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '50%', // Top position relative to parent
  left: '49%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning
};
const spinerContainer = document.querySelector('.js-backdrop');
const spinner = new Spinner(opts);
//активуємо спінер
// spinner.spin(spinerContainer); // ( в дужках на чому повинен крутитися)

///////////////////////SPINNER/////////////////////////

/////////////////////////OBSERVER//////////////

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

const callback = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      loadMoreData();
    }
  });
};

const observer = new IntersectionObserver(callback, options);

////////////////////OBSERVER/////////////////////

async function onSearchClick(evt) {
  evt.preventDefault();
  spinnerPlay();
  const form = evt.currentTarget;
  searchQuery = form.elements['user-search-query'].value.trim();
  page = 1; // кожен новий запит на нові картинки починається з 1 ст
  //коли йде запит на сервер може статися помилка тому це потрібно вірно обробити
  try {
    //   const response = await getPhotos(query) --- витягли з респонсу дату і потім масив результату
    const {
      data: { results, total_pages },
    } = await getPhotos(searchQuery, page, perPage);
    console.log(results);
    if (!results.length) {
      iziToast.warning({
        title: 'Caution',
        message: 'Please enter something for search',
      });
    }

    gallery.innerHTML = createMarkup(results);
    hasMoreData(total_pages);
    simplelightbox.refresh();
  } catch (err) {
    console.log(err);
  } finally {
    form.reset();
    spinnerStop();
  }
}

//безкінечний скрол
async function loadMoreData() {
  page += 1;
  spinnerPlay();
  try {
    const {
      data: { results, total_pages },
    } = await getPhotos(searchQuery, page, perPage);

    gallery.insertAdjacentHTML('beforeend', createMarkup(results));
    hasMoreData(total_pages);
    simplelightbox.refresh();
  } catch (err) {
    console.log(err);
  } finally {
    spinnerStop();
  }
}
function createMarkup(arr) {
  return arr
    .map(
      ({
        alt_description,
        urls: { small, full },
      }) => `   <li class="gallery-item" >
      <a class="gallery-img" href="${full}" target='blank'>
        <img src="${small}" alt="${alt_description}" />
      </a>
    </li>`
    )
    .join('');
}

function spinnerPlay() {
  spinner.spin(spinerContainer);
  spinerContainer.classList.remove('is-hidden');
}
function spinnerStop() {
  spinner.stop();
  spinerContainer.classList.add('is-hidden');
}
function hasMoreData(lastPage) {
  if (page < lastPage) {
    //то слідкуємо далі за останнім елем
    const lastArrItem = document.querySelector('.gallery-item:last-child');
    observer.observe(lastArrItem);
  } else {
    iziToast.error({
      title: 'Caution',
      message: 'Sorry but it`s the last pictures in our server',
    });
  }
}
