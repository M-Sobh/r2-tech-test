const apiRouter = require("express").Router();
const { readFile } = require("fs/promises");
// const { getRecipes } = require("../controllers/recipes");

apiRouter.get("/", (_, res) => {
  res.json({ message: "ok" });
});

// Endpoint to Get all recipes

apiRouter.get(`/recipes`, (req, res) => {
  readFile("./data/data.json", "utf8")
    .then((data) => {
      res.status(200).send({ recipes: JSON.parse(data) });
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

module.exports = apiRouter;
