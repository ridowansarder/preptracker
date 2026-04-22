import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";

const EditDialog = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: item.title,
    type: item.type,
    topic: item.topic || "",
    notes: item.notes || "",
    status: item.status,
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosInstance.put(`/items/${item._id}`, form);
      onSave(res.data.item);
      onClose();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update item.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      {/* Dialog */}
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">Edit Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="problem">Problem</option>
                <option value="concept">Concept</option>
                <option value="question">Question</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="revision">Revision</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Topic</label>
            <input
              name="topic"
              value={form.topic}
              onChange={handleChange}
              placeholder="e.g. Arrays, Closures"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Optional notes"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ItemDetail = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axiosInstance.get(`/items/${id}`);
        setItem(res.data.item);
      } catch (err) {
        console.error(err);
        setError("Failed to load item.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 overflow-hidden">
      <Link
        to="/items"
        className="text-sm text-indigo-600 hover:underline mb-6 inline-block cursor-pointer"
      >
        ⬅️ Back to Items
      </Link>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start flex-col md:flex-row md:justify-between gap-4 mb-4">
          <h1 className="text-xl font-black text-gray-800">{item.title}</h1>
          <div className="flex gap-2 shrink-0">
            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                item.type === "problem"
                  ? "bg-blue-50 text-blue-600"
                  : item.type === "concept"
                    ? "bg-purple-50 text-purple-600"
                    : "bg-green-50 text-green-600"
              }`}
            >
              {item.type}
            </span>
            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                item.status === "completed"
                  ? "bg-green-50 text-green-600"
                  : item.status === "revision"
                    ? "bg-yellow-50 text-yellow-600"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-600 mb-6">
          {item.topic && (
            <p>
              <span className="font-medium text-gray-700">Topic:</span>{" "}
              {item.topic}
            </p>
          )}
          {item.notes && (
            <p>
              <span className="font-medium text-gray-700">Notes:</span>{" "}
              {item.notes}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Added on {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => setShowEdit(true)}
          className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
        >
          Edit Item
        </button>
      </div>

      {showEdit && (
        <EditDialog
          item={item}
          onClose={() => setShowEdit(false)}
          onSave={(updated) => setItem(updated)}
        />
      )}
    </div>
  );
};

export default ItemDetail;
