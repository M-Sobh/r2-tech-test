const supertest = require("supertest");
const server = require("../server");

const request = supertest(server);

test("/api", async () => {
  const { body } = await request.get("/api").expect(200);
  expect(body.message).toBe("ok");
});
test("/api/recipes", () => {
  //const { body } = await request;
  return request.get("/api/recipes").expect(200);
  // .then((res) => {
  //   console.log(res, "<======");
  //   expect(res).toContainKeys([
  //     "id",
  //     "imageUrl",
  //     "instructions",
  //     "ingredients",
  //   ]);
  // });
});
