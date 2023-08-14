import icons from 'url:../../img/icons.svg';
import parentView from './parentView';
class searchView extends parentView {
  _parentEl = document.querySelector('.search');
  _searchData = this._data;

  getQuery() {
    const getQuery = this._parentEl.querySelector('.search__field').value;
    this.clearInput();

    return getQuery;
  }

  clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new searchView();
