import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { Link } from "react-router-dom";

const initialForm = { title: "", type: "problem", topic: "", notes: "" };

const AddItemDialog = ({ onClose, onAdd }) => {
  const [form, setForm] = useState(initialForm);
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
      const res = await axiosInstance.post("/items", form);
      onAdd(res.data.item);
      onClose();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add item.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Two Sum"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

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
              <input
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Optional notes"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
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
              {submitting ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filters, setFilters] = useState({ status: "", type: "" });

  const fetchItems = useCallback(async (activeFilters = filters) => {
  try {
    const params = new URLSearchParams();
    if (activeFilters.status) params.append("status", activeFilters.status);
    if (activeFilters.type) params.append("type", activeFilters.type);

    const res = await axiosInstance.get(`/items?${params.toString()}`);
    setItems(res.data.items);
  } catch (err) {
    console.error(err);
    setError("Failed to load items.");
  } finally {
    setLoading(false);
  }
}, [filters]);

useEffect(() => {
  fetchItems();
}, [fetchItems]);

  const handleFilterChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    fetchItems(updated);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?",
    );
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/items/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await axiosInstance.put(`/items/${id}`, { status });
      setItems((prev) =>
        prev.map((item) => (item._id === id ? res.data.item : item)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Items</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
        >
          + Add Item
        </button>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold">All Items ({items.length})</h2>
          <div className="flex gap-2">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="revision">Revision</option>
            </select>

            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="problem">Problem</option>
              <option value="concept">Concept</option>
              <option value="question">Question</option>
            </select>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No items yet. Add one above.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 rounded-lg p-4 gap-3 hover:shadow-sm transition"
              >
                <Link to={`/items/${item._id}`} className="flex flex-col gap-1">
                  <p className="font-medium text-gray-800 text-sm">
                    {item.title}
                  </p>
                  {item.topic && (
                    <p className="text-xs text-gray-400">{item.topic}</p>
                  )}
                  <div className="flex gap-2 mt-1">
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
                </Link>

                <div className="flex items-center gap-2">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value)
                    }
                    className="text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="revision">Revision</option>
                  </select>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <AddItemDialog
          onClose={() => setShowAdd(false)}
          onAdd={(newItem) => setItems((prev) => [newItem, ...prev])}
        />
      )}
    </div>
  );
};

export default Items;
