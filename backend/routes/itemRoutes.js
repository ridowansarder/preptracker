import {
  getItems,
  createItem,
  deleteItem,
  updateItem,
  getItem,
} from "../controllers/itemController.js";
import { protect } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.use(protect);

router.get("/", getItems);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.get("/:id", getItem);

export default router;
