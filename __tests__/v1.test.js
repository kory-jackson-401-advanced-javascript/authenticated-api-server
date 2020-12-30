"use strict";

const serverObj = require("../server.js");
const supergoose = require("@code-fellows/supergoose");
const mockRequest = supergoose(serverObj.app);
const mockServer = jest.fn(serverObj.start)
const categoriesModel = require("../models/categories/categories-model.js");
const productsModel = require("../models/products/products-model.js");
const { expect, it, describe } = require("@jest/globals");

function categoriesCreate(name) {
  return {
    "name": name,
    "description": "description",
  };
}

function productsCreate(name, category) {
  return {
    "name": name,
    "description": "description",
    "price": 77,
    "category": category,
    "inStock": 7,
  };
}

const category1 = categoriesCreate("food");
const category2 = categoriesCreate("supplies");
const products1 = productsCreate("spaghetti", "food");
const products2 = productsCreate("pencils", "supplies");

beforeAll(async (done) => {
  await mockRequest.post("/api/v1/categories").send(category1);
  await mockRequest.post("/api/v1/categories").send(category2);
  await mockRequest.post("/api/v1/products").send(products1);
  await mockRequest.post("/api/v1/products").send(products2);
  done();
});


describe("categories testing", () => {
  it("gets all categories", async () => {
    let response = await mockRequest.get("/api/v1/categories");

    expect(response).toBeDefined();
    expect(response.body.count).toBe(2);
    expect(response.body.results[0].name).toBe("food");
  });

  it("gets one categories", async () => {
    let categories = await mockRequest.get("/api/v1/categories");
    let id = categories.body.results[0]._id;
    let response = await mockRequest.get(`/api/v1/categories/${id}`);

    expect(response.body.name).toBe("food");
  });

  it("updates category", async () => {
    let categories = await mockRequest.get("/api/v1/categories");
    let id = categories.body.results[1]._id;
    
    expect(categories.body.results[1].name).toBe("supplies")
    
    let response = await mockRequest.put(`/api/v1/categories/${id}`).send(categoriesCreate("celery"));

    expect(response.body.name).toBe("celery");
  })

  it("deletes category", async () => {
    let categories = await mockRequest.get("/api/v1/categories");
    let id = categories.body.results[1]._id;
    
    expect(categories.body.count).toBe(2)
    
    let response = await mockRequest.delete(`/api/v1/categories/${id}`);
    expect(response.status).toBe(200);

    let newCategories = await mockRequest.get("/api/v1/categories");


    expect(newCategories.body.count).toBe(1);

  })
});

describe("products testing", () => {
  it("gets all products", async () => {
    let response = await mockRequest.get("/api/v1/products");

    expect(response).toBeDefined();
    expect(response.body.count).toBe(2);
    expect(response.body.results[0].name).toBe("spaghetti");
  });

  it("gets one products", async () => {
    let products = await mockRequest.get("/api/v1/products");
    let id = products.body.results[0]._id;
    let response = await mockRequest.get(`/api/v1/products/${id}`);

    expect(response.body.name).toBe("spaghetti");
  });

  it("updates category", async () => {
    let products = await mockRequest.get("/api/v1/products");
    let id = products.body.results[1]._id;
    
    expect(products.body.results[1].name).toBe("pencils")
    
    let response = await mockRequest.put(`/api/v1/products/${id}`).send(productsCreate("celery"));

    expect(response.body.name).toBe("celery");
  })

  it("deletes category", async () => {
    let products = await mockRequest.get("/api/v1/products");
    let id = products.body.results[1]._id;
    
    expect(products.body.count).toBe(2)
    
    let response = await mockRequest.delete(`/api/v1/products/${id}`);
    expect(response.status).toBe(200);

    let newProducts = await mockRequest.get("/api/v1/products");


    expect(newProducts.body.count).toBe(1);

  })
});

describe("lists all models", () => {
  it("lists models", async () => {
    let response = await mockRequest.get("/api/v1/models");
    expect(response.body).toStrictEqual(["categories", "products", "todo"])
  })
})

describe("creates an error", () => {
  it("throws 404", async () => {

    let response = await mockRequest.get("/categories");
    
    expect(response.status).toBe(404)
  })

  it("throws 500", async () => {
    let response = await mockRequest.get("/api/v1/todo")

    expect(response.status).toBe(500)
  })
})
