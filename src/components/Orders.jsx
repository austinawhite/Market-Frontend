import { useEffect, useState } from "react";

export default function Orders({ token }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("http://localhost:3000/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    }

    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="orders">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
         {orders.map((order, index) => (
          <li key={order.id} className="order-card">
            <strong>Your Order #{index + 1}</strong><br />
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            <p>Note: {order.note || '—'}</p>
          </li>
          ))}
        </ul>
      )}
    </div>
  );
}