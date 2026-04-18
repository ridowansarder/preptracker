import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";

const typeColors = {
  problem: "bg-purple-100 text-purple-700",
  concept: "bg-orange-100 text-orange-700",
  question: "bg-pink-100 text-pink-700",
};

const Revision = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRevisionItems = async () => {
    try {
      const res = await axiosInstance.get("/items?status=revision");
      setItems(res.data.items);
    } catch (err) {
      console.error(err);
      setError("Failed to load revision items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisionItems();
  }, []);

  const handleMarkCompleted = async (id) => {
    try {
      await axiosInstance.put(`/items/${id}`, { status: "completed" });
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-black mb-2">Revision</h1>
      <p className="text-sm text-gray-500 mb-6">
        Items you need to revisit before they're done.
      </p>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          <p className="text-gray-400 text-sm">No items in revision. You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 rounded-xl p-4 gap-3 hover:shadow-sm transition"
            >
              <div className="flex flex-col gap-1">
                <p className="font-medium text-gray-800">{item.title}</p>
                {item.topic && (
                  <p className="text-xs text-gray-400">{item.topic}</p>
                )}
                {item.notes && (
                  <p className="text-xs text-gray-500 italic">{item.notes}</p>
                )}
                <span className={`self-start text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${typeColors[item.type]}`}>
                  {item.type}
                </span>
              </div>

              <button
                onClick={() => handleMarkCompleted(item._id)}
                className="self-start sm:self-center text-xs bg-green-50 text-green-600 px-4 py-1.5 rounded-lg hover:bg-green-100 transition cursor-pointer whitespace-nowrap"
              >
                Mark as Completed ✔️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Revision;