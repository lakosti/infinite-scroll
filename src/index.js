import axios from 'axios';

// const input = document.querySelector('.search-input');
const form = document.querySelector('.js-search-form');
const searchBtn = document.querySelector('.search-btn');
const gallery = document.querySelector('.js-gallery');

axios.defaults.baseURL = 'https://api.unsplash.com';
axios.defaults.headers.common['Authorization'] =
  'Client-ID LxvKVGJqiSe6NcEVZOaLXC-f2JIIWZaq_o0WrF8mwJc';

form.addEventListener('submit', onSearchClick);

function getPhotos(query) {
  return axios.get('/search/photos', {
    params: {
      query,
      orientation: 'portrait',
    },
  });
}

async function onSearchClick(evt) {
  evt.preventDefault();

  const form = evt.currentTarget;
  const query = form.elements['user-search-query'].value.trim();

  //коли йде запит на сервер може статися помилка тому це потрібно вірно обробити
  try {
    //   const response = await getPhotos(query)
    const {
      data: { results },
    } = await getPhotos(query);
    gallery.innerHTML = createMarkup(results);

    if (!results.length) {
      alert('Please enter something');
      gallery.innerHTML = '';
      return;
    }
  } catch (err) {
    console.log(err);
  } finally {
    form.reset();
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({ urls: { small } }) => `  <li>
<img src=${small}>
  </li>`
    )
    .join('');
}
