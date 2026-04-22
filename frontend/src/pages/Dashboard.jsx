import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/dashboard");
        setData(res.data.dashboard);
      } catch (err) {
        setError(err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (error) return <p className="text-center text-red-500 mt-10">{error.message}</p>;

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 p-6">
      <h1 className="text-2xl font-black mb-6">
        Hi, {user.name.split(" ")[0]}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Items</p>
          <h2 className="text-2xl font-semibold text-blue-600">
            {data.totalItems}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-2xl font-semibold text-green-600">
            {data.completedItems}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Revision</p>
          <h2 className="text-2xl font-semibold text-yellow-600">
            {data.revisionItems}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="text-2xl font-semibold text-gray-700">
            {data.pendingItems}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold  mb-4">
          Recent Items
        </h2>

        {data.recentItems.length === 0 ? (
          <p className="text-gray-500">No recent items</p>
        ) : (
          <div className="space-y-4">
            {data.recentItems.map((item) => (
              <div
                key={item._id}
                className=" border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
              >
                <Link to={`/items/${item._id}`} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

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
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
