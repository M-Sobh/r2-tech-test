const supertest = require("supertest");
const server = require("../server");

const request = supertest(server);

test("/api", async () => {
  const { body } = await request.get("/api").expect(200);
  expect(body.message).toBe("ok");
});

describe("/api/recipes", () => {
  test("Get status:200, serves an array of recipes", async () => {
    const { body } = await request.get("/api/recipes").expect(200);
    expect(body.recipes).toContainKeys([
      "id",
      "imageUrl",
      "instructions",
      "ingredients",
    ]);
  });
  test("Get status:200, accepts an exclude_ingredients query", async () => {
    const { body } = await request
      .get("/api/recipes?exclude_ingredients=apples,bananas,carrots")
      .expect(200);
    expect(body.recipes).toSatisfy((recipes) => {
      return recipes.every(({ recipe }) =>
        recipe.ingredients.doesNotContain(exclude_ingredients)
      ); // <===== Sudo Code
    });
  });
});

describe("/api/recipes/:id", () => {
  test("Get status:200, serves up a recipe by id ", async () => {
    const { body } = await request.get("/api/recipes/recipe-59").expect(200);
    expect(body.recipe).toBeArray();
    expect(body.recipe.length).toBe(1);
    expect(body.recipe.id).toBe("recipe-59");
    expect(body.recipe).toContainKeys([
      "id",
      "imageUrl",
      "instructions",
      "ingredients",
    ]);
  });
  test.only("GET status:404, when passed a valid non-existent id", async () => {
    const { body } = await request.get("/api/recipes/recipe-1000").expect(404);
    expect(body.msg).toBe("recipe not found");
  });
  test("GET status:400, when passed an invalid id", async () => {
    const { body } = await request
      .get("/api/recipes/not-a-valid-id")
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
});
