
import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  RefreshCw,
  Clock,
  MapPin,
  CreditCard,
  User,
  AlertCircle,
  CheckCircle2,
  Calendar,
  IndianRupee,
  ChevronDown
} from "lucide-react";
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

const STATUS_THEMES = {
  PLACED: "bg-blue-50 text-blue-700 border-blue-200",
  CONFIRMED: "bg-purple-50 text-purple-700 border-purple-200",
  PREPARING: "bg-amber-50 text-amber-700 border-amber-200",
  OUT_FOR_DELIVERY: "bg-orange-50 text-orange-700 border-orange-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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
      setSuccessMessage("");

      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus }),
      });

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

      setSuccessMessage(`Order #${orderId.slice(-6)} status updated to ${orderStatus}`);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to update order status");
    } finally {
      setUpdatingId("");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "ALL") return true;
    return o.orderStatus === statusFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 mb-1">
            <ShoppingBag size={15} />
            <span>Fulfillment & Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage live customer orders, view full delivery addresses and update progression statuses.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl text-xs sm:text-sm font-medium border bg-rose-50 text-rose-700 border-rose-200">
          <AlertCircle size={18} className="shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl text-xs sm:text-sm font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-orange-100">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            statusFilter === "ALL"
              ? "bg-orange-500 text-white shadow-xs"
              : "text-slate-600 hover:bg-orange-50"
          }`}
        >
          All Orders ({orders.length})
        </button>
        {ORDER_STATUSES.map((status) => {
          const count = orders.filter((o) => o.orderStatus === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                statusFilter === status
                  ? "bg-orange-500 text-white shadow-xs"
                  : "text-slate-600 hover:bg-orange-50"
              }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-orange-100 p-12 text-center text-slate-400 space-y-3">
          <RefreshCw size={28} className="animate-spin mx-auto text-orange-500" />
          <p className="text-sm font-semibold">Loading orders from MongoDB...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-orange-100 p-12 text-center text-slate-400 space-y-3">
          <ShoppingBag size={36} className="mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No orders found.</p>
          <p className="text-xs text-slate-400">
            {statusFilter === "ALL"
              ? "New customer orders will appear here automatically."
              : `There are currently no orders with status "${statusFilter}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order._id;
            const themeClass =
              STATUS_THEMES[order.orderStatus] || "bg-slate-50 text-slate-700 border-slate-200";

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-orange-100 shadow-xs hover:border-orange-200 transition-all p-5 sm:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-extrabold text-slate-900 text-base">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold border ${themeClass}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar size={13} />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400">Update Status:</span>
                    <div className="relative">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        disabled={isUpdating}
                        className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer disabled:opacity-50"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                    {isUpdating && <RefreshCw size={14} className="animate-spin text-orange-500" />}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs sm:text-sm">
                  {/* Customer Info */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <User size={13} />
                      <span>Customer Details</span>
                    </div>
                    <div className="font-bold text-slate-800">
                      {order.user?.name || "Customer User"}
                    </div>
                    <div className="text-slate-500">{order.user?.email || "No email available"}</div>
                    {order.user?.phone && (
                      <div className="text-slate-500">Phone: {order.user.phone}</div>
                    )}
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <MapPin size={13} />
                      <span>Delivery Address</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {order.deliveryAddress || "Address not provided"}
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <CreditCard size={13} />
                      <span>Payment Info</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">
                        {order.paymentMethod || "COD"}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          order.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.paymentStatus || "PENDING"}
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-slate-900 pt-1">
                      Total: {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Ordered Items summary list */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Ordered Dishes ({order.items?.length || 0})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-xl bg-orange-50/40 border border-orange-100/60 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="h-5 w-5 shrink-0 rounded-md bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[10px]">
                            {item.quantity}x
                          </span>
                          <span className="font-semibold text-slate-800 truncate">
                            {item.name || item.food?.name}
                          </span>
                        </div>
                        <span className="font-bold text-slate-700 shrink-0 ml-2">
                          ₹{(item.price || 0) * (item.quantity || 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
