import { itemModel } from "../models/itemModel.js";

export const getItems = async (req, res) => {
  const { status, type } = req.query;

  const filter = { userId: req.user.id };

  if (status) filter.status = status;
  if (type) filter.type = type;

  try {
    const items = await itemModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createItem = async (req, res) => {
  const { title, type, topic, notes } = req.body;

  if (!title || !type) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  }

  try {
    const item = await itemModel.create({
      userId: req.user.id,
      title,
      type,
      topic: topic || "",
      notes: notes || "",
    });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await itemModel.findById(id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    if (item.userId.toString() !== req.user.id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await item.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const { title, type, topic, notes, status } = req.body;

  try {
    const item = await itemModel.findById(id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    if (item.userId.toString() !== req.user.id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updateItem = await itemModel.findByIdAndUpdate(
      id,
      {
        title,
        type,
        topic,
        notes,
        status,
      },
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json({ success: true, item: updateItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getItem = async (req, res) => {
  try {
    const item = await itemModel.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
