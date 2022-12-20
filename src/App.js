import logo from './result.svg';
import './App.css';
import FirebaseAuthService from './FirebaseAuthService';
import FirebaseFirestoreService from './FirebaseFirestoreService';
import { startTransition, useEffect, useState } from 'react';
import LoginForm from './Components/LoginForm';
import AddEditRecipeForm from './Components/AddEditRecipeForm';

function App() {
  const [user, setUser] = useState(null);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [orderBy, setOrderBy] = useState("publishDateDesc");
  const [recipesPerPage, setRecipesPerPage] = useState(3);

  useEffect(() => {
    fetchRecipes()
      .then((fetchedRecipes) => {
        setRecipes(fetchedRecipes);
      })
      .catch((err) => {
        alert(err.message);
        throw err;
      })
  // eslint-disable-next-line
  },[user, categoryFilter, orderBy, recipesPerPage])

  FirebaseAuthService.subscribeToAuthChanges(setUser);

  async function fetchRecipes(cursorId = '') {
    const queries = [];

    if (!user) {
      queries.push({
        field: 'isPublished',
        condition: '==',
        value: true,
      })
    }

    if (categoryFilter) {
      queries.push({
        field: 'category',
        condition: '==',
        value: categoryFilter,
      })
    }

    const orderByField = "publishDate"
    let orderByDirection;

    if (orderBy) {
      switch (orderBy) {
        case "publishDateAsc":
          orderByDirection = "asc";
          break;
        case "publishDateDesc":
          orderByDirection = "desc";
          break;
        default:
          break;
      }
    }

    let fetchedRecipes = []

    try {
      const response = await FirebaseFirestoreService.readDocuments({
        collectionName: 'recipes',
        queries: queries,
        orderByField: orderByField,
        orderByDirection: orderByDirection,
        perPage: recipesPerPage,
        cursorId: cursorId,
      })

      const newRecipes = response.docs.map((recipeDoc) => {
        const id = recipeDoc.id;
        const data = recipeDoc.data();
        data.publishDate = new Date(data.publishDate.seconds * 1000);

        return { ...data, id};

      })

      if (cursorId) {
        fetchedRecipes = [...recipes, ...newRecipes]
      } else {
        fetchedRecipes = [ ...newRecipes ];
      }

    } catch (err) {
      alert(err.message);
      throw err;
    }

    setIsLoading(false);
    return fetchedRecipes;
  }

  function handleRecipesPerPageChange(event) {
    const recipesPerPage = event.target.value
    setRecipes([])
    setRecipesPerPage(recipesPerPage)
  }

  function handleFetchMore() {
    const last = recipes[recipes.length - 1]
    const cursorId = last.id

    handleFetchRecipes(cursorId);
  }

  async function handleFetchRecipes(cursorId = '') {
    try {
      const fetchedRecipes = await fetchRecipes(cursorId);

      setRecipes(fetchedRecipes);
    } catch (error) {
      alert(error.message);
      throw error
    }
  }

  async function handleAddRecipe(newRecipe) {
    try {
      const resp = await FirebaseFirestoreService.createDocument('recipes', newRecipe)
      console.log('response', resp)

      handleFetchRecipes()
      alert(`Successfully created ${resp.id}`)
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleEditRecipe(newRecipe, recipeId) {
    try {
      await FirebaseFirestoreService.updateDocument("recipes", recipeId, newRecipe)

      handleFetchRecipes()

      alert(`Updated recipe ${recipeId}`)
    } catch (error) {
      alert(error.message)
    }
  }
  
  async function handleDeleteRecipe(recipeId) {
    try {
      await FirebaseFirestoreService.deleteDocument("recipes", recipeId)

      handleFetchRecipes()

      alert(`Deleted recipe ${recipeId}`)
    } catch (error) {
      alert(error.message)
    }
  }

  function handleEditRecipeClick(recipeId) {
    const selectedRecipe = recipes.find((recipe) => {
      return recipe.id === recipeId;
    })

    if (selectedRecipe) {
      startTransition(() => {
        setCurrentRecipe(selectedRecipe);
      });
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  function handleEditRecipeCancel() {
    startTransition(() => {
      setCurrentRecipe(null);
    });
  }

  const formatCategory = (category) => {
    const catDict = {
      breadsSandwichesAndPizza: "Bread, sandwiches, and pizza",
      eggsAndBreakfast: "Eggs and breakfast",
      dessertsAndBakedGoods: "Desserts and baked goods",
      fishAndSeafood: "Fish and seafood",
      vegetables: "Vegetables",
    }

    return catDict[category]
  }

  const formatTime = (time) => {
    const day = time.getUTCDate();
    const month = time.getUTCMonth() + 1;
    const year = time.getFullYear();

    return `${month}/${day}/${year}`
  }

  return (
    <div className="App">
      <header className="App-header">
        <LoginForm existingUser={user}/>
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <h3>Filters</h3>
          <label>
              Category: 
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value=""></option>
                  <option value="breadsSandwichesAndPizza">Breads, Sandwiches, and Pizza</option>
                  <option value="eggsAndBreakfast">Eggs and Breakfast</option>
                  <option value="dessertsAndBakedGoods">Desserts and Baked Goods</option>
                  <option value="fishAndSeafood">Fish and Seafood</option>
                  <option value="vegetables">Vegetables</option>
              </select>
          </label>
          <label>
              Order By: 
              <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
                  <option value="publishDateAsc">Publish Date Ascending</option>
                  <option value="publishDateDesc">Publish Date Descending</option>
              </select>
          </label>
        </div>
        <div>
          {isLoading ? (
            <div>LOADING</div>
          ) : null}
          {!isLoading && recipes && recipes.length === 0 ? (
            <div>NO RESULTS</div>
          ) : null}
          {recipes && recipes.length > 0 ? (
            <div>
              {recipes.map((recipe) => {
                return (
                  <div key={recipe.id}>
                    {recipe.isPublished === false ? (
                      <div>UNPUBLISHED</div>
                    ) : null}
                    <div>{recipe.name}</div>
                    <img height={100} width={100} src={recipe.imageUrl} alt={recipe.imageUrl} />
                    <div>{formatCategory(recipe.category)}</div>
                    <div>{recipe.directions}</div>
                    <div>{formatTime(recipe.publishDate)}</div>
                    {user ? (
                      <>
                        <button type='button' onClick={() => handleEditRecipeClick(recipe.id)}>Edit Recipe</button>
                        <button type='button' onClick={() => handleDeleteRecipe(recipe.id)}>Delete Recipe</button>
                      </>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : null}
          <div>
            <label>
                Per page: 
                <select value={recipesPerPage} onChange={handleRecipesPerPageChange}>
                    <option value={3}>3</option>
                    <option value={6}>6</option>
                </select>
            </label>
            <button type='button' onClick={handleFetchMore}>Load More</button>
          </div>
        </div>
      <AddEditRecipeForm handleAddRecipe={handleAddRecipe} handleEditRecipe={handleEditRecipe} handleEditRecipeCancel={handleEditRecipeCancel} currentRecipe={currentRecipe}/>
      </header>
    </div>
  );
}

export default App;
