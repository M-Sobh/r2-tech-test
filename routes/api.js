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
      res.status(404).send({ error: "No recipes found" });
    });
});

module.exports = apiRouter;
