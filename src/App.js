import logo from './logo.svg';
import './App.css';
import FirebaseAuthService from './FirebaseAuthService';
import FirebaseFirestoreService from './FirebaseFirestoreService';
import { useEffect, useState } from 'react';
import LoginForm from './Components/LoginForm';
import AddEditRecipeForm from './Components/AddEditRecipeForm';

function App() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState(null);

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
  },[user])

  FirebaseAuthService.subscribeToAuthChanges(setUser);

  async function fetchRecipes() {
    const queries = [];

    if (!user) {
      queries.push({
        field: 'isPublished',
        condition: '==',
        value: true,
      })
    }
    let fetchedRecipes = []

    try {
      const response = await FirebaseFirestoreService.readDocument({collectionName: 'recipes', queries: queries})

      const newRecipes = response.docs.map((recipeDoc) => {
        const id = recipeDoc.id;
        const data = recipeDoc.data();
        data.publishDate = new Date(data.publishDate.seconds * 1000);

        return { ...data, id};

      })

      fetchedRecipes = [ ...newRecipes ];
    } catch (err) {
      alert(err.message);
    }

    return fetchedRecipes;
  }

  async function handleFetchRecipes() {
    try {
      const fetchedRecipes = await fetchRecipes();

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
          {recipes && recipes.length > 0 ? (
            <div>
              {recipes.map((recipe) => {
                return (
                  <div key={recipe.id}>
                    {recipe.isPublished === false ? (
                      <div>UNPUBLISHED</div>
                    ) : null}
                    <div>{recipe.name}</div>
                    <div>{formatCategory(recipe.category)}</div>
                    <div>{recipe.directions}</div>
                    <div>{formatTime(recipe.publishDate)}</div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
      <AddEditRecipeForm handleAddRecipe={handleAddRecipe} />
      </header>
    </div>
  );
}

export default App;
