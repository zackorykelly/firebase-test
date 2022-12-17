import { useState } from "react"

function AddEditRecipeForm({ handleAddRecipe }) {
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [publishDate, setPublishDate] = useState(new Date().toISOString().split("T")[0])
    const [directions, setDirections] = useState("")
    const [ingredients, setIngredients] = useState([])
    const [ingredientName, setIngredientName] = useState("")

    function handleAddIngredient(e) {
        if (e.key && e.key !== "Enter") {
            return;
        }
        e.preventDefault()
        if (!ingredientName) {
            alert("Missing ingredient name")
            return;
        }

        setIngredients([...ingredients, ingredientName])
        setIngredientName("");
    }

    function handleRecipeFormSubmit(e) {
        e.preventDefault()

        if (ingredients.length === 0) {
            alert("No ingredients!");
            return
        }

        const isPublished = new Date(publishDate) <= new Date() ? true : false

        const newRecipe = {
            name,
            category,
            directions,
            publishDate: new Date(publishDate),
            isPublished,
            ingredients,
        }

        handleAddRecipe(newRecipe);
    }

    return (
    <form onSubmit={handleRecipeFormSubmit}>
        <h2>Add a new recipe</h2>
        <div>
        <label>
            Recipe Name: 
            <input
            required
            type={"text"}
            value={name}
            onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
            Category: 
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value=""></option>
                <option value="breadsSandwichesAndPizza">Breads, Sandwiches, and Pizza</option>
                <option value="eggsAndBreakfast">Eggs and Breakfast</option>
                <option value="dessertsAndBakedGoods">Desserts and Baked Goods</option>
                <option value="fishAndSeafood">Fish and Seafood</option>
                <option value="vegetables">Vegetables</option>
            </select>
        </label>
        <label>
            Directions: 
            <textarea required value={directions} onChange={(e) => setDirections(e.target.value)}>
            </textarea>
        </label>
        <label>
            Publish Date: 
            <input type={"date"} required value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
        </label>
        </div>
        <div>
            <h3>Ingredients</h3>
            <table>
                <thead>
                    <tr>
                        <th>Ingredient</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {ingredients && ingredients.length > 0 ? ingredients.map((ingredient) => {
                        return (
                            <tr key={ingredient}>
                                <td>{ingredient}</td>
                                <td>
                                    <button type="button">Delete</button>
                                </td>
                            </tr>
                        )
                    }) : null}
                </tbody>
            </table>
            {ingredients && ingredients.length === 0 ? <h3>No Ingredients Added Yet</h3> : null}
            <div>
                <label>
                    Ingredient: 
                    <input type={"text"} value={ingredientName} onChange={(e) => setIngredientName(e.target.value)} placeholder="Ex. 1 Cup of Sugar" onKeyPress={handleAddIngredient} />
                </label>
                <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
            </div>
        </div>
        <div>
            <button type="submit">Create Recipe</button>
        </div>
    </form>
    )
}

export default AddEditRecipeForm