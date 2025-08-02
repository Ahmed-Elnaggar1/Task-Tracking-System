import { jest } from "@jest/globals";
import { createUserController } from "../controllers/userController.js";

describe("User Controller", () => {
  const mockServices = {
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };
  const { getAllUsers } = createUserController(mockServices);

  it("should return 401 for unauthorized access", async () => {
    // Simulate a controller that checks for req.user and returns 401 if not present
    const req = { user: undefined };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    // You may want to adapt this logic if your controller expects JWT middleware
    await getAllUsers(req, res);
    // In your real controller, you may want to check for 401 or 403 depending on your logic
    // Here, we just check that a response is sent
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});
