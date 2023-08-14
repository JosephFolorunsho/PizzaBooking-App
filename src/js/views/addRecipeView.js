import icons from 'url:../../img/icons.svg';
import parentView from './parentView';

class addRecipeView extends parentView {
  _parentEl = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _errorMessage = 'No recipes found for your query. Please try again!';
  message = 'Recipe added succesfully ✅ ';

  constructor() {
    super();
    this._addHandlerShowModal();
    this._addHandlerCloseModal();
  }

  toggleForm() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowModal() {
    this._btnOpen.addEventListener('click', this.toggleForm.bind(this));
  }

  _addHandlerCloseModal() {
    this._btnClose.addEventListener('click', this.toggleForm.bind(this));
    this._overlay.addEventListener('click', this.toggleForm.bind(this));
  }
  // get data from form
  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }
}

export default new addRecipeView();
