import express from "express";
import { getTimeLogs, addTimeLog } from "../controllers/timeLogController.js";
import auth from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

router.get("/", auth, getTimeLogs);
router.post("/", auth, addTimeLog);

export default router;
