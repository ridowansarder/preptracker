import { itemModel } from "../models/itemModel.js";

export const getDashboard = async (req, res) => {
  try {
    const { id } = req.user;

    const [totalItems, completedItems, revisionItems, recentItems] =
      await Promise.all([
        itemModel.countDocuments({ userId: id }),
        itemModel.countDocuments({ userId: id, status: "completed" }),
        itemModel.countDocuments({ userId: id, status: "revision" }),
        itemModel.find({ userId: id }).sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    res.status(200).json({
        success: true,
        dashboard: {
            totalItems,
            completedItems,
            revisionItems,
            recentItems,
            pendingItems: totalItems - completedItems - revisionItems
        }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
