const { login } = require("../controllers/users");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

jest.mock("../models/user", () => ({
  User: {
    findOne: jest.fn().mockResolvedValue({
      email: "existing@example.com",
      password: "hashedPassword",
      save: jest.fn(),
    }),
  },
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mockedToken"),
}));

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("login test", () => {
  it("log in a user with valid credentials", async () => {
    const req = {
      body: {
        email: "existing@example.com",
        password: "password",
      },
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "mockedToken",
      user: {
        email: "existing@example.com",
        subscription: "starter",
      },
    });
    console.log("Status Code:", res.status.mock.calls[0][0]);
    console.log("Token:", jest.requireMock("jsonwebtoken").sign());
    console.log("User:", res.json.mock.calls[0][0].user);
  });

  it("should return a 401 status when logging in with invalid credentials", async () => {
    const req = {
      body: {
        email: "nonexisting@example.com",
        password: "password",
      },
    };

    User.findOne.mockResolvedValueOnce(null);
    bcrypt.compare.mockResolvedValueOnce(false);

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Email or password is wrong" });
  });
});
