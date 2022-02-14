const apiRouter = require("express").Router();
const { readFile, writeFile } = require("fs/promises");

// const { getRecipes } = require("../controllers/recipes");

apiRouter.get("/", (_, res) => {
  res.json({ message: "ok" });
});

// Endpoint to Get all recipes

apiRouter.get(`/recipes`, (req, res) => {
  readFile("./data/data.json", "utf8")
    .then((data) => {
      let recipes = JSON.parse(data);
      let excIngredients = req.query.exclude_ingredients;
      //let regex = /apples|bananas|carrots/g
      let regex = new RegExp("#" + excIngredients + "#", "g");
      if (excIngredients) {
        recipes.map((recipe) => {
          recipe.ingredients.map((ingredient) => {
            if (ingredient.name === regex) {
              let filteredRecipes = _.remove(recipes, function () {
                return recipe;
              });
              return filteredRecipes;
            }
          });
        });
        res.status(200).send({ recipes: filteredRecipes });
      } else {
        res.status(200).send({ recipes: recipes });
      }
    })
    .catch(() => {
      res.status(404).send({ error: "Sorry, No recipes found." });
    });
});

// Endpoint to Get a recipe by ID

apiRouter.get(`/recipes/:id`, (req, res) => {
  readFile(`./data/data.json`, "utf8")
    .then((data) => {
      const recipes = JSON.parse(data);
      const recipesIds = recipes.map((recipe) => {
        return recipe.id;
      });
      if (!recipesIds.includes(req.params.id)) {
        return Promise.reject({ status: 404, msg: "recipe not found" });
      }
      let recipeById = recipes.filter((recipe) => {
        if (recipe.id == req.params.id) {
          return recipe;
        }
      });

      res.status(200).send({ recipe: recipeById });
    })
    .catch(() => {
      res
        .status(404)
        .send({ error: "Sorry, No recipe found with the Id you entered." });
    });
});

// Endpoint to post new recipe

apiRouter.post(`/recipes`, (req, res) => {
  readFile("./data/data.json", "utf8").then((data) => {
    const recipes = JSON.parse(data);
    let newRecipe = req.body;
    recipes.push(newRecipe);
    let newRecipes = JSON.stringify(recipes, null, 2);
    res.status(201).send({ recipes: JSON.parse(newRecipes) });
    writeFile(
      "./data/data.json",
      newRecipes,
      "utf-8",
      { flag: "a+" },
      (err) => {
        if (err) {
          console.log(error);
          return;
        }
        console.log("New recipe added");
      }
    );
  });
});

module.exports = apiRouter;
