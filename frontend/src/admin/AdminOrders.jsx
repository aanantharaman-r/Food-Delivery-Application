
import React, { useEffect, useState } from "react";
import { ShoppingBag, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api/admin";

const ORDER_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load orders");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setError("Authentication token not found. Please log in again.");
      setLoading(false);
    }
  }, [token]);

  const updateOrderStatus = async (orderId, orderStatus) => {
    try {
      setUpdatingId(orderId);
      setError("");

      const response = await fetch(
        `${API_URL}/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update order status");
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: data.order.orderStatus }
            : order
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update order status");
    } finally {
      setUpdatingId("");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Order Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View customer orders and update their status.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-3 text-orange-600">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Order Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-700">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>

                      <td className="p-4 text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="p-4">
                        <p className="font-medium text-gray-800">
                          {order.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.user?.email || "-"}
                        </p>
                      </td>

                      <td className="p-4">{order.items?.length || 0}</td>

                      <td className="p-4 font-semibold text-gray-800">
                        {formatAmount(order.totalAmount)}
                      </td>

                      <td className="p-4">
                        <p>{order.paymentMethod || "-"}</p>
                        <p className="text-xs text-gray-500">
                          {order.paymentStatus || "PENDING"}
                        </p>
                      </td>

                      <td className="p-4">
                        <select
                          value={order.orderStatus || "PLACED"}
                          disabled={updatingId === order._id}
                          onChange={(event) =>
                            updateOrderStatus(order._id, event.target.value)
                          }
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-orange-500 disabled:opacity-50"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status.replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>

                        {updatingId === order._id && (
                          <p className="mt-1 text-xs text-orange-600">
                            Updating...
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
