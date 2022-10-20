// key=${API_KEY}
// const options = {
//   key: '13420675-ac3576debf8258c428cd202e5',
// };
import axios from 'axios';

const API_KEY = '13420675-ac3576debf8258c428cd202e5';
const BASE_URL = 'https://pixabay.com/api/';

export default class PhotoApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchPhoto() {
    console.log(this);

    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&per_page=${this.per_page}&image_type=photo&orientation=horizontal&safesearch=true`;

    // return fetch(url)
    //   .then(response => response.json())
    //   .then(photo => {
    //     this.incrementPage();
    //     console.log('totalHits = ', photo.totalHits);
    //     return photo;
    //   });
    return await axios
      .get(url)
      .then(response => {
        return response.data;
      })
      .catch(error => console.error(error))
      .then(photo => {
        this.incrementPage();
        console.log('totalHits = ', photo.totalHits);
        return photo;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  // countPhoto() {
  //   return this.page * this.per_page;
  // }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
