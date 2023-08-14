import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarkView from './views/bookmarkView';
import addRecipeView from './views/addRecipeView';

// if (module.hot) {
//   module.hot.accept();
// }

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    //Load Spinner
    recipeView.renderLoadingSpinner();

    //Update results view to mark selected search view
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);

    //Load Recipe
    await model.loadRecipe(id);
    console.log(model.state.recipe);

    //Render Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    //Render Error Message
    recipeView.renderErrorMessage();
  }
};

const controlSearch = async function () {
  try {
    //(1) Render Spinner
    resultsView.renderLoadingSpinner();

    //get Query
    const query = searchView.getQuery();
    if (!query) return;

    //(2) Load Search results
    await model.searchRecipe(query);

    //(3) Render Search results
    resultsView.render(model.getSearchResultsPage());

    // (4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    resultsView.renderErrorMessage();
  }
};

const controlPagination = function (goToPage) {
  //(1) Render  NEW Search results

  resultsView.render(model.getSearchResultsPage(goToPage));

  // (2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlRecipeUpdate = function (goToServ) {
  //update servings in the state
  model.updateServings(goToServ);

  //render new ingredients
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add recipe to bookmark array
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }

  //render bookmark
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);

  console.log('works');
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (newRecipeData) {
  try {
    // render spinner
    addRecipeView.renderLoadingSpinner();

    await model.uploadRecipe(newRecipeData);

    //Render recipe
    recipeView.render(model.state.recipe);

    //render success message
    addRecipeView.renderMessage();

    //render bookarks view
    bookmarkView.render(model.state.bookmarks);

    //close form
    setTimeout(function () {
      addRecipeView.toggleForm();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderErrorMessage(error.message);
  }
};
//initials
const init = function () {
  bookmarkView.addHandlerRenderBookmark(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlRecipeUpdate);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPageClick(controlPagination);
  addRecipeView.addHandlerUpload(controlUploadRecipe);
};
init();
