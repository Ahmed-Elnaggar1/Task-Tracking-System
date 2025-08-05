import { jest } from "@jest/globals";
import { createAuthController } from "../controllers/authController.js";

describe("Auth Controller", () => {
  const mockServices = {
    findUserByEmail: jest.fn(),
    validatePassword: jest.fn(),
    createUser: jest.fn(),
  };
  const { loginUser } = createAuthController(mockServices);

  it("should return 400 for missing credentials on login", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.any(String),
      errorSubcode: "MISSING_CREDENTIALS",
    });
  });
});
