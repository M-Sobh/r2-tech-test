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
  test("GET status:404, when passed a valid non-existent id", async () => {
    const { body } = await request.get("/api/recipes/recipe-1000").expect(404);
    expect(body.msg).toBe("recipe not found");
  });
  test.only("GET status:400, when passed an invalid id", async () => {
    const { body } = await request
      .get("/api/recipes/not-a-valid-id")
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
});

describe("/api/recipes", () => {
  test("POST status:201, returns new recipe when passed a valid recipe", async () => {
    const recipeToPost = {
      id: "recipe-101",
      imageUrl: "http://www.images.com/18",
      instructions:
        "60 seconds on the highest setting your blender has, or until a smooth paste has formed",
      ingredients: [
        {
          name: "demerara sugar",
          grams: 25,
        },
        {
          name: "flax",
          grams: 66,
        },
        {
          name: "apple juice",
          grams: 44,
        },
        {
          name: "oat milk",
          grams: 198,
        },
      ],
    };
    const { body } = await request
      .post("/api/recipes")
      .send(recipeToPost)
      .expect(201);
    expect(body).toContainKeys([
      "id",
      "imageUrl",
      "instructions",
      "ingredients",
    ]);
    expect(body.id).toBe(recipeToPost.id);
    expect(body.imageUrl).toBe(recipeToPost.imageUrl);
    expect(body.instructions).toBe(recipeToPost.instructions);
    expect(body.ingredients).toEqual(recipeToPost.ingredients);
  });
  test("POST status:400, when posted recipe is missing properties", async () => {
    const recipeToPost = {
      id: "recipe-101",
      imageUrl: "http://www.images.com/18",
      instructions:
        "60 seconds on the highest setting your blender has, or until a smooth paste has formed",
    };
    const { body } = await request
      .post("/api/recipes")
      .send(recipeToPost)
      .expect(404);
    expect(body.msg).toBe("Not Found");
  });
  test("INVALID METHOD status:405", async () => {
    const { body } = await request.put("/api/recipes").expect(405);
    expect(body.msg).toBe("Method Not Allowed");
  });
});
