import './css/common.css';
import PhotoApiService from './js/api-service';
import photoTpl from './templates/photo.hbs';
import LoadMoreBtn from './js/components/load-more-btn';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  photoContainer: document.querySelector('.gallery'),
};

const photoApiService = new PhotoApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.form.addEventListener('submit', onSearchQuery);
loadMoreBtn.refs.button.addEventListener('click', fetchPhoto);

function onSearchQuery(e) {
  e.preventDefault();

  photoApiService.searchQuery = e.currentTarget.elements.searchQuery.value;

  if (photoApiService.query.trim() === '') {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }

  photoApiService.resetPage();
  clearPhotoContainer();
  fetchPhoto();
}

function appendPhotoMarkup(photo) {
  refs.photoContainer.insertAdjacentHTML('beforeend', photoTpl(photo.hits));
}

async function fetchPhoto() {
  try {
    loadMoreBtn.show();
    loadMoreBtn.disable();
    await photoApiService.fetchPhoto().then(photo => {
      if (photo.totalHits === 0) {
        loadMoreBtn.hide();
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      }

      appendPhotoMarkup(photo);
      loadMoreBtn.enable();
      Notify.success(`"Hooray! We found ${photo.totalHits} images."`);
      simpleLightbox.refresh();

      let totalPages = photo.totalHits / photoApiService.per_page;
      if (photoApiService.page > totalPages) {
        loadMoreBtn.hide();
        return Notify.info("We're sorry, but you've reached the end of search results.");
      }
    });

    //smooth scroll
    const { height: cardHeight } = refs.photoContainer.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    //===
  } catch (error) {
    console.log(error);
  }
}

function clearPhotoContainer() {
  refs.photoContainer.innerHTML = '';
}

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoomFactor: false,
});
