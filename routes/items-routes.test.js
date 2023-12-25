process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const items = require("../fakeDb");
let item = { name: "Candy", price: 1.89 };

beforeEach(function() {
  items.push(item);
});

afterEach(function() {
  // make sure this *mutates*, not redefines, `items`
  items.length = 0;
});
//end afterEach

/** GET /items - returns `{items: [item, ...]}` */
describe("GET /items", function() {
  test("Gets a list of items", async function() {
    const resp = await request(app).get(`/items`);
    const {items} =resp.body 
    expect(resp.statusCode).toBe(200);
    expect(items).toHaveLength(1);
  });
});

/** GET /items/[name] - return data about one item: `{item: item}` */
describe("GET /items/:name", function() {
  test("Gets a single item", async function() {
    const resp = await request(app).get(`/items/${item.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.item).toEqual(item);
  });
  test("Responds with 404 if can't find item", async function() {
    const resp = await request(app).get(`/items/0`);
    expect(resp.statusCode).toBe(404);
  });
});
// end

/** POST /items - create item; return `{item: item}` */

describe("POST /items", function() {
  test("Creates a new item",async function() {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "Tomato",
        price: 1.56
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body.item).toHaveProperty('name');
    expect(resp.body.item).toHaveProperty('price');
    expect(resp.body.item.name).toEqual("Tomato");
    expect(resp.body.item.price).toEqual(1.56);
    });
  });
// end

/** PATCH /items/[name]  return `{item: item}` */
describe("PATCH /items/:name", function() {
  test("Updates a single item", async function() {
    const resp = await request(app)
      .patch(`/items/${item.name}`)
      .send({
      name : "beer"
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      item: { name: "beer"}
    });
  });
  test("Responds with 404 if id invalid", async function() {
    const resp = await request(app).patch(`/items/0`);
    expect(resp.statusCode).toBe(404);
  });
});
// end
/** DELETE and return `{message: "Item deleted"}` */
describe("DELETE /items/:name", function() {
  test("Deletes a single a item", async function() {
    const resp = await request(app).delete(`/items/${item.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
});
// end
