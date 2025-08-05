import request from "supertest";
import express from "express";
import timeLogRoutes from "../routes/timeLogRoutes.js";

const app = express();
app.use(express.json());
app.use("/api/tasks/:id/timelogs", timeLogRoutes);

describe("TimeLog Routes", () => {
  it("should return 401 for unauthorized access", async () => {
    const res = await request(app).get("/api/tasks/1/timelogs");
    expect(res.statusCode).toBe(401);
  });
});
