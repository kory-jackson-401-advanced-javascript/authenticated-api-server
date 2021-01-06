const serverObj = require("../server.js");
const supergoose = require("@code-fellows/supergoose");
const mockRequest = supergoose(serverObj.app);
const mockServer = jest.fn(serverObj.start)


const createUser = (obj, role) => {
  return {
    "username": obj,
    "password": obj,
    "role": role,
  }
}


const admin = createUser("admin", "admin");
const editor = createUser("editor", "editor");
const author = createUser("author", "author");
const guest = createUser("guest", "guest");

beforeAll(async (done) => {
  await mockRequest.post("/signup").send(admin);
  await mockRequest.post("/signup").send(editor);
  await mockRequest.post("/signup").send(author);
  await mockRequest.post("/signup").send(guest);

  done();
})
describe("Signup route", () => {
  it("signs up a user", async () => {
    let userObj = createUser("test")
    let response = await mockRequest.post("/signup").send(userObj);

    expect(response.status).toBe(201);
    expect(response.body.user.username).toStrictEqual("test");
  })

  it("does not allow same sign in", async () => {
    let userObj = createUser("admin", "admin");
    let response = await mockRequest.post("/signup").send(userObj);
    
    expect(response.body).toStrictEqual({error: "Username already exists" })
    expect(response.status).toBe(500);
  })

  it("must require password", async () => {
    let userObj = {
      "username": "test1",
      "role": "guest"
    };

    let response = await mockRequest.post("/signup").send(userObj);
    console.log(response.body)
    expect(response.status).toBe(500);
  })
});

describe("Signin Route", () => {
  it("signs in a user", async () => {
    let response = await mockRequest.post("/signin").auth("admin", "admin");
    const token = response.body.token;

    expect(token).toBeDefined();

  })
})

describe("server listening", () => {
  it("listens", () => {
    let server = mockServer(3000);

    expect(server).toBeDefined();
  })
})

describe("Hits protected routes", () => {
  it("can update", async () => {
    let auth = await mockRequest.post("/signin").auth("admin", "admin");
    const token = auth.body.token;

    let response = await mockRequest.put("/article").auth(token, { type: "bearer" });
  
    expect(response.text).toStrictEqual("You have permission to UPDATE")
  })
  it("can create", async () => {
    let auth = await mockRequest.post("/signin").auth("admin", "admin");
    const token = auth.body.token;

    let response = await mockRequest.post("/article").auth(token, { type: "bearer" });
  
    expect(response.text).toStrictEqual("You have permission to CREATE")
  });
  it("can read", async () => {
    let auth = await mockRequest.post("/signin").auth("admin", "admin");
    const token = auth.body.token;

    let response = await mockRequest.get("/article").auth(token, { type: "bearer" });
  
    expect(response.text).toStrictEqual("You have permission to READ")
  });
  it("can delete", async () => {
    let auth = await mockRequest.post("/signin").auth("admin", "admin");
    const token = auth.body.token;

    let response = await mockRequest.delete("/article").auth(token, { type: "bearer" });
  
    expect(response.text).toStrictEqual("You have permission to DELETE")
  });
  it("can doesn't allow permission", async () => {
    let auth = await mockRequest.post("/signin").auth("guest", "guest");
    const token = auth.body.token;

    let response = await mockRequest.put("/article").auth(token, { type: "bearer" });
    expect(response.body).toStrictEqual({error:"You do not have the correct permissions for this action as a(n) guest."})
  })
  it("gets secret", async () => {
    let auth = await mockRequest.post("/signin").auth("admin", "admin");
    const token = auth.body.token;

    let response = await mockRequest.get("/secret").auth(token, { type: "bearer" });
  
    expect(response.text).toStrictEqual("Welcome, admin")

  })

})

describe("does not authenticate", () => {
  it("can not authenticate bearer", async () => {
    let response = await mockRequest.put("/article").auth(123456, { type: "bearer" });
    expect(response.text).toStrictEqual("{\"error\":\"Invalid Login\"}");
    expect(response.status).toBe(500);
  })

  it("does not have auth", async () => {
    let response = await mockRequest.put("/article").send({ type: "bearer" });

    expect(response.body).toStrictEqual({error: "Invalid Credentials"})
  })

  it("can not authenticate basic", async () => {
    let response = await mockRequest.post("/signin").auth("admin", "amin");

    expect(response.body).toStrictEqual({error: "Invalid Credentials"});
  })
})
