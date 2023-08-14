import icons from 'url:../../img/icons.svg';
import parentView from './parentView';

class resultsView extends parentView {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your search. Please try another one!';
  _message = '';

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
        </a>
    </li>
    `;
  }
}

export default new resultsView();
