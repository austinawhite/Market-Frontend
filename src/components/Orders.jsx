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
        <ul>
          {orders.map((order, index) => (
  <li key={order.id} style={{ marginBottom: '1rem' }}>
    <strong>Your Order #{index + 1}</strong><br />
    Date: {new Date(order.date).toLocaleDateString()}<br />
    Note: {order.note || '—'}
  </li>
))}
        </ul>
      )}
    </div>
  );
}