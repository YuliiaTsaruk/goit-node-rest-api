import mongoose from "mongoose";
import request from "supertest";

import app from "../app.js";

import { findUser, deleteUsers } from "../services/authServices.js";

const { TEST_DB_HOST, PORT = 3000 } = process.env;

describe("test /login route", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(TEST_DB_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await deleteUsers({});
  });

  test("test /login with correct data", async () => {
    const loginData = {
      token,
      user: { email: "user.test@mail.com", subscription: "starter" },
    };
    const { statusCode, body } = await request(app)
      .post("/api/users/login")
      .send(loginData);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty("token");
    expect(typeof body.token).toBe("string");

    expect(body.user).toBeDefined();
    expect(body.user).toHaveProperty("email");
    expect(typeof body.user.email).toBe("string");
    expect(body.user).toHaveProperty("subscription");
    expect(typeof body.user.subscription).toBe("string");

    const user = await findUser({ email: loginData.email });
    expect(user.email).toBe(loginData.email);
    expect(user.subscription).toBe(loginData.subscription);
  });
});
