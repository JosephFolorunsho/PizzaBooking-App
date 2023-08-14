import icons from 'url:../../img/icons.svg';
import parentView from './parentView';

class bookmarkView extends parentView {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRenderBookmark(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data.map(res => this._generateMarkupPreview(res)).join(' ');
  }
  _generateMarkupPreview(result) {
    //id from url
    const id = window.location.hash.slice(1);
    return `
    <li class="preview">
        <a class="preview__link ${
          result.id === id ? 'preview__link--active' : ''
        }" href="#${result.id}">
            <figure class="preview__fig">
                <img src="${result.imageUrl}" alt="Test" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
                <div class="preview__user-generated ${
                  !result.key ? 'hidden' : ''
                }">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
                </div>
            </div>
        </a>
    </li>
    `;
  }
}

export default new bookmarkView();
