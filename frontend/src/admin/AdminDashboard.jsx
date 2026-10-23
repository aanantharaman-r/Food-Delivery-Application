
import React from "react";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1>Food Delivery Admin</h1>
      <p>Welcome to your Admin Dashboard!</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Orders</h3>
          <h2>0</h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Foods</h3>
          <h2>0</h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Users</h3>
          <h2>0</h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Revenue</h3>
          <h2>₹0</h2>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#ffffff",
  padding: "24px",
  borderRadius: "14px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  color: "#222",
};
