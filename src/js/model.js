import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { getJSON, sendJSON } from './helpers';
export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    // check Bookamrks array to see  if recipe has been bookmarked
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(`${err}🔥😌😌📷📷🐦`);
    throw err;
  }
};

export const searchRecipe = async function (query) {
  try {
    const searchQuery = query;
    const data = await getJSON(`${API_URL}?search=${searchQuery}&key=${KEY}`);

    state.search.result = data.data.recipes.map(res => {
      return {
        imageUrl: res.image_url,
        id: res.id,
        publisher: res.publisher,
        title: res.title,
        ...(res.key && { key: res.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;

  return state.search.result.slice(start, end);
};

export const updateServings = function (newServings) {
  // console.log(model.state.recipe.ingredients);
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark();
};

export const removeBookmark = function (id) {
  //remove bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark current recipe as bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
};

const persistBookmark = function () {
  // pushes the bookmarks array to local storage
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const data = Object.entries(newRecipe).filter(
      entry => entry[0].startsWith('ingredient') && entry[1] !== ''
    );
    const ingredient = data.map(ing => {
      const ingArr = ing[1].split(',').map(el => el.trim());
      const [quantity, unit, description] = ingArr;
      return { quantity: quantity ? +quantity : null, unit, description };
    });
    if (ingredient.length !== 3)
      throw new Error(
        'Wrong ingredient format! Please use the correct format ;)'
      );
    const sendRecipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      ingredients: ingredient,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
    };
    const sentData = await sendJSON(`${API_URL}?key=${KEY}`, sendRecipe);
    state.recipe = createRecipeObject(sentData);
    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  //gets bookmark array from local storage
  const localStorageData = localStorage.getItem('bookmarks');
  const storage = JSON.parse(localStorageData);

  if (storage) state.bookmarks = storage;
};
init();
